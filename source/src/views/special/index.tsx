import Theme from 'src/components/theme'
import * as React from 'react'

const data = [{
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
}, {
  id: 2,
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      id: 4,
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      time: new Date()
    }
  ]
},{
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
}, {
  id: 2,
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      id: 4,
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      time: new Date()
    }
  ]
},{
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
}, {
  id: 2,
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      id: 4,
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      time: new Date()
    }
  ]
},{
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
}, {
  id: 2,
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      id: 4,
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      time: new Date()
    }
  ]
},{
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
}, {
  id: 2,
  title: 'HTTP/2 相关',
  desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
  articles: [
    {
      id: 4,
      title: '谈谈 Nginx 的 HTTP/2 POST Bug',
      link: 'https://www.baidu.com',
      time: new Date()
    }
  ]
}]

function Special() {
  return (
    <Theme 
      title="归档"
      desc="博客写了这么多年，数量一直没上去。大部分时候遇上有意思的东西，研究明白之后只是多了几篇收藏，或者是 Evernote 里多了几段零散的记录，又或者是电脑某个文件夹多了几个 Demo 文件。很难再有耐心和精力把整个过程记录一遍。这里把本站部分文章以专题的形式整理出来，一方面方便新同学阅读，另一方面也希望借此激励自己：能在这个浮躁的时代，坚持阅读和写作。"
      columns={data}
    />
  )
}

export default Special