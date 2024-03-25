import type { ProfileDetail, ProfileRequestBody } from "@/types/member"
import { http } from "@/utils/http"

// /member/profile
export const getMemberProfileAPI = () => {
    return http<ProfileDetail>({
        url: '/member/profile',
        method: 'GET'
    })
}
// 修改个人信息接口
// /member/profile
export const putMemberProfileAPI = (data: ProfileRequestBody) => {
    return http<ProfileDetail>({
        url: '/member/profile',
        method: 'PUT',
        data
    })
}
