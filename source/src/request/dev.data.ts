import { getColumnList } from './config'

const grendList = (item: any, count:number) => {
  const ret = []
  for (let i = 0; i < count; i++) {
    ret.push({...item, id: i, title: item.title + i})
  }

  return ret
}

const devData = {
  [getColumnList]: grendList({
    id: 1,
    title: 'HTTP/2 相关',
    desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
    articles: [
      {
        id: 3,
        title: '谈谈 Nginx 的 HTTP/2 POST Bug',
        link: 'https://www.baidu.com',
        time: new Date()
      }
    ]
  }, 50)
}

export default devData