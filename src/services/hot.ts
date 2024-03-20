import type { PageParams } from '@/types/global';
import type { HotResult } from '@/types/hot';
// import { PageParams } from '@/types/global';

import { http } from "@/utils/http"

type HotParams = PageParams & {subType ?: string}
export const getHotCommonAPI = (url: string, data?: HotParams) => {
    return http<HotResult>({
        url,
        method: 'GET',
        data
    })
}