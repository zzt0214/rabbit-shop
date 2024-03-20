import type { CategoryTopItem } from "@/types/category"
import { http } from "@/utils/http"


// /category/top
export const getCatoryTopAPI = () =>{
    return http<CategoryTopItem>({
        url: "/category/top",
        method: "GET"
    })
}