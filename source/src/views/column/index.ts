import './style.module.css'
import ColumnItem from 'src/components/column-item'

const data = [{
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      date: new Date()
    }
  ]
}, {
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      date: new Date()
    }
  ]
}]

function Column() {
  const columns = data.map((item, i) => <ColumnItem key={i} {...item} />)

  return (
    <div>
      {columns}
    </div>
  )
}

export default Column