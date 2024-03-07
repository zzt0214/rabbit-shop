import type { BannerItem, CategoryItem, HotItem } from "@/types/hoem";
import { http } from "@/utils/http";

export const getHomeBannerAPI = (distributionSite = 1) =>{
    return http<BannerItem[]>({
        url: "/home/banner",
        method: "GET",
        data: {
            distributionSite
        }
    })
}
// /home/category/mutli
export const getHomeCategoryAPI = ()=> {
    return http<CategoryItem[]>({
        url: "/home/category/mutli",
        method: "GET"
    })
}

// /home/hot/mutli
export const getHomeHotAPI = ()=> {
    return http<HotItem[]>({
        url: "/home/hot/mutli",
        method: "GET"
    })
}

