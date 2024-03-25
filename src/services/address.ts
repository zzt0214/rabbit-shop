import type { AddressItem, AddressParams } from "@/types/address"
import { http } from "@/utils/http"


// 新增地址 /member/address
export const setMemberAddress = (data: AddressParams) => {
    return http({
        url: '/member/address',
        method: 'POST',
        data
    })
}

// 查询地址 /member/address
export const getMemberAddressAPI = () => {
    return http<AddressItem[]>({
        url: '/member/address',
        method: 'GET',
    })
}
// 通过ID获取详情信息 /member/address/{id}
export const getMemberAddressByIdAPI = (id: string) => {
    return http<AddressItem>({
        url: `/member/address/${id}`,
        method: 'GET',
    })
}
// 修改地址 /member/address/{id}
export const putMemberAddressAPI = (id: string, data: AddressParams) => {
    return http({
        url: `/member/address/${id}`,
        method: 'PUT',
        data
    })
}

// 通过ID删除 /member/address/{id}
export const deleteMemberAddressByIdAPI = (id: string) => {
    return http({
        url: `/member/address/${id}`,
        method: 'DELETE',
    })
}