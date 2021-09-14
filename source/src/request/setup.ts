import axios from 'axios'

// 不需要loadding的加载
export const notLoadUrls: Array<string> = []

const stopRequest = () => {
  const source = axios.CancelToken.source()
  source.cancel('Illegal request')
}

axios.interceptors.request.use(config => {
  if (!config.url) {
    return stopRequest();
  }

  if (notLoadUrls.includes(config.url)) {
    return config
  } else {
    return stopRequest()
  }
})


axios.interceptors.response.use(res => {
  if (res.status !== 200) {
    alert('请求错误')
  } else {
    return res.data
  }
})