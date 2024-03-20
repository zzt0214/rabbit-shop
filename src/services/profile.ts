import type { ProfileDetail } from "@/types/member"
import { http } from "@/utils/http"

// /member/profile
export const getMemberProfileAPI = () => {
    return http<ProfileDetail>({
        url: '/member/profile',
        method: 'GET'
    })
}