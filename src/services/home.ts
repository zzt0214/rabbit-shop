import type { PageParams, PageResult } from "@/types/global";
import type { BannerItem, CategoryItem, GuessItem, HotItem } from "@/types/hoem";
import { http } from "@/utils/http";

// 获取banner
export const getHomeBannerAPI = (distributionSite = 1) =>{
    return http<BannerItem[]>({
        url: "/home/banner",
        method: "GET",
        data: {
            distributionSite
        }
    })
}
// 获取分类
export const getHomeCategoryAPI = ()=> {
    return http<CategoryItem[]>({
        url: "/home/category/mutli",
        method: "GET"
    })
}

// 获取热门商品
export const getHomeHotAPI = ()=> {
    return http<HotItem[]>({
        url: "/home/hot/mutli",
        method: "GET"
    })
}
// 获取猜你喜欢  /home/goods/guessLike
export const getHomeGuessLikeAPI = (data?: PageParams)=> {
    return http<PageResult<GuessItem>>({
        url: "/home/goods/guessLike",
        method: "GET",
        data
    })
}

