<script setup lang="ts">
//导入组件
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import type { XtxGuessInstance } from '@/types/component'
import PageSkeleton from './components/PageSkeleton.vue'
const homeBannerData = ref<BannerItem[]>([])
const homeCategoryList = ref<CategoryItem[]>([])
const hotList = ref<HotItem[]>([])

// 加载时调用
onLoad(async () => {
  // getHomeBannerData()
  // getHomeCategoryData()
  isShow.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  isShow.value = false
})
// 变量
// 猜你喜欢子组件
const guessRef = ref<XtxGuessInstance>()
// 是否显示骨架屏
const isShow = ref(false)
// 方法
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  homeBannerData.value = res.result
}

const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  homeCategoryList.value = res.result
}

const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}
// 滚动到底部触发的事件
const onScrolltolower = () => {
  guessRef.value?.getMore()
}
// 定义代表下拉刷新的状态
const isTriggered = ref(false)
// 下拉刷新事件

const onRefresherrefresh = async () => {
  isTriggered.value = true
  // 重置字组件的数据
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
    guessRef.value?.getMore(),
  ])
  isTriggered.value = false
}
</script>

<template>
  <CustomNavbar />
  <PageSkeleton v-if="isShow" />
  <template v-else>
    <scroll-view
      class="box"
      scroll-y
      @scrolltolower="onScrolltolower"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <XtxSwiper :list="homeBannerData" />
      <CategoryPanel :list="homeCategoryList" />
      <HotPanel :list="hotList" />
      <XtxGuess ref="guessRef" />
    </scroll-view>
  </template>
</template>

<style lang="scss">
page {
  background-color: #f3f3f3;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.box {
  flex: 1;
}
</style>
