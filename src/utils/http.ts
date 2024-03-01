import { useMemberStore } from "@/stores"


// 请求基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const httpInterceptor = {
    invoke(options: UniApp.RequestOptions) {
        // request 触发前拼接 url 
        if (!options.url.startsWith("http")) {
            options.url = baseURL + options.url
        }
        // 设置token和时间
        options.timeout = 10000
        options.header = {
            ...options.header,
            'source-client': 'miniapp',
        }
        const token = useMemberStore().profile?.token
        if (token) {
            options.header.Authorization = token
        }
    },
    success(args: any) {
      // 请求成功后，修改code值为1
    }, 
    fail(err: any) {
      console.log('interceptor-fail',err)
    }, 
    complete(res: any) {
      console.log('interceptor-complete',res)
    }
}
// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

type Data<T> =  {
  code: string,
  msg: string,
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) =>{
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res){
        // 通过状态码判断是否有错误
        if(res.statusCode >= 200 && res.statusCode < 300){
          // 请求成功操作
          resolve(res.data as Data<T>)
        }else if(res.statusCode >= 401){
          // token过期
          const userInfo = useMemberStore()
          userInfo.clearProfile()
          uni.navigateTo({ url: '/pages/login' })
          reject(res)
        }else {
          // 其他错误
          uni.showToast({
            title: (res.data as Data<T>).msg || '请求错误',
            icon: 'none'
          })
          reject(res)
        }
      },
      // 相应失败
      fail(error){
        uni.showToast({
          title: '网络错误，换个网络试试',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}