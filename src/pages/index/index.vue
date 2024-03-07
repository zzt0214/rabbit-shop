<script setup lang="ts">
//导入组件
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/hoem'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'

const homeBannerData = ref<BannerItem[]>([])
const homeCategoryList = ref<CategoryItem[]>([])
const hotList = ref<HotItem[]>([])

// 加载时调用
onLoad(() => {
  // getHomeBannerData()
  // getHomeCategoryData()
  Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
})
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
</script>

<template>
  <CustomNavbar />
  <scroll-view class="box" scroll-y>
    <XtxSwiper :list="homeBannerData" />
    <CategoryPanel :list="homeCategoryList" />
    <HotPanel :list="hotList" />
    <XtxGuess />
  </scroll-view>
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
