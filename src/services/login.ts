import type { LoginResult } from "@/types/member"
import { http } from "@/utils/http"

// /login/wxMin/simple
export const LoginWxMinAPI = (phoneNumber: string)=>{
    return http<LoginResult>({
        url: "/login/wxMin/simple",
        method: "POST",
        data: {
            phoneNumber
        }
    })
}