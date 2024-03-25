<script setup lang="ts">
import { getMemberProfileAPI, putMemberProfileAPI } from '@/services/profile'
import { useMemberStore } from '@/stores'
import type { Gender, ProfileDetail } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 对应响应式式数据
// 提示：当使用v-model时，未指定初始值({} as ProfileDetail)，会报错
const profile = ref<ProfileDetail>({} as ProfileDetail)
// 页面加载
onLoad(() => {
  getMemberProfileData()
})
// 获取用户信息
const getMemberProfileData = async () => {
  const res = await getMemberProfileAPI()
  console.log(memberStore.profile)
  profile.value = res.result
}
const memberStore = useMemberStore()
// 日期组件
const onChangeDate: UniHelper.DatePickerOnChange = (e) => {
  profile.value!.birthday = e.detail.value
}
let fullCLocationCode: [string, string, string] = ['', '', '']
// 区域
const onChangeRegion: UniHelper.RegionPickerOnChange = (e) => {
  // 前端显示 ["北京市", "北京市", "东城区"]
  profile.value!.fullLocation = e.detail.value.join(' ')
  // 后端请求 ["110000", "110100", "110101"]
  fullCLocationCode = e.detail.code!
}
// 单选框
const handleGenderChange: UniHelper.RadioGroupOnChange = (e) => {
  profile.value!.gender = e.detail.value as Gender
}
// 上传图片
const updateAvatar = () => {
  // uniap上传图片的组件
  uni.chooseMedia({
    // 数量为1
    count: 1,
    mediaType: ['image'],
    success: (res) => {
      console.log(res)
      // 解构出临时文件
      const { tempFilePath } = res.tempFiles[0]
      // 上传文件到服务器
      uni.uploadFile({
        url: '/member/profile/avatar',
        filePath: tempFilePath,
        name: 'file',
        success: (res) => {
          console.log(res)
          if (res.statusCode === 200) {
            // 上传成功
            // 服务器返回的数据，为JSON
            const { avatar } = JSON.parse(res.data).result
            console.log(avatar)
            profile.value!.avatar = avatar
            // 同步数据到Store TODO 有问题
            memberStore.profile!.avatar = avatar
            uni.showToast({ icon: 'success', title: '更新成功' })
          } else {
            // 上传失败
            uni.showToast({ icon: 'error', title: '未知错误' })
          }
        },
        fail: (err) => {
          console.log(err)
        },
      })
    },
  })
}
// 提交
const onSubmit = async () => {
  // 怎么优雅的处理
  const { nickname, gender, birthday, profession } = profile.value
  let res
  if (fullCLocationCode[0] === '') {
    // 更新数据
    res = await putMemberProfileAPI({
      nickname,
      gender,
      birthday,
      profession,
    })
  } else {
    // 更新数据
    res = await putMemberProfileAPI({
      nickname,
      gender,
      birthday,
      profession,
      provinceCode: fullCLocationCode[0],
      cityCode: fullCLocationCode[1],
      countyCode: fullCLocationCode[2],
    })
  }
  if (res.code === '1') {
    // 成功
    // 怎么保存到Store
    uni.showToast({ icon: 'success', title: '更新成功' })
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } else {
    uni.showToast({ icon: 'error', title: '更新失败' })
  }
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content" @tap="updateAvatar">
        <image class="image" :src="profile?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ profile?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" type="text" placeholder="请填写昵称" v-model="profile!.nickname" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="handleGenderChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="profile?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="profile?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            start="1900-01-01"
            :end="new Date()"
            :value="profile?.birthday"
            @change="onChangeDate"
          >
            <view v-if="profile?.birthday">{{ profile?.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            class="picker"
            mode="region"
            :value="profile?.fullLocation?.split(' ')"
            @change="onChangeRegion"
          >
            <view v-if="profile?.fullLocation">{{ profile?.fullLocation }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input class="input" type="text" placeholder="请填写职业" v-model="profile!.profession" />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="onSubmit">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
