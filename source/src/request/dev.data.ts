import { getColumnList } from './config'

const article = () => ({
  id: 1,
  title: 'JavaScript的宏任务与微任务',
  desc: '我们都知道JavaScript是一门单线程非阻塞的脚本语言，这意味着JavaScript在执行期间都是只有一个主线程来处理所有任务的。而非阻塞是指当代码有异步任务是，主线程会挂 起这个异步任务，当这个异步任务执行完毕后，主线程才会在适当时期去执行这个任务的回调。',
  time: new Date(),
  body: '## 事件队列与事件循环\r\n' +
  '&emsp;&emsp;我们都知道JavaScript是一门单线程非阻塞的脚本语言，这意味着JavaScript在执行期间都是只有一个主线程来处理所有任务的。而非阻塞是指当代码有异步任务是，主线程会挂 起这个异步任务，当这个异步任务执行完毕后，主线程才会在适当时期去执行这个任务的回调。<br>\r\n' +
  '&emsp;&emsp;当异步任务处理完毕后，JavaScript会将这个任务放置在一个队列中，我们称这个任务为`事件队列`。这个队列上的上的回调不会立即执行，而是当当前执行栈中的所有任务处理 完之后才会去执行`事件队列`的任务。<br>\r\n' +
  '&emsp;&emsp;`队列`是先进先出的线性表。在具体应用中通常用链表或者数组来实现。具体资料参考[维基百科](https://zh.wikipedia.org/wiki/%E9%98%9F%E5%88%97)<br>\r\n' +
  '&emsp;&emsp;当前执行栈执行完毕后，JavaScript会去检查当前事件队列是否有任务，如果有则将这个任务添加到当前执行栈中执行这个任务，当任务执行执行完毕后又重复这一操作，构成了 一个循环，而这个循环我们就称之为`事件循环`。整体的流程如下图所示\r\n' +
  '\r\n' +
  '![event-queue](./image/event-queue1.drawio.svg)\r\n' +
  '\r\n' +
  '## 宏任务与微任务\r\n' +
  '&emsp;&emsp;异步任务分为两种类型，`微任务(microtask)`和`微任务(macrotask)`，不同类型的任务会被分配到不同的`事件队列`中，执行的时机也会有所不同，为了方便表达我把微任务事 件队列称之为`微事件队列`，宏任务事件队列称之为`宏任务队列`。<br>\r\n' +
  '&emsp;&emsp;`事件循环`检查当前事件队列时，首先检查当前`微事件队列`是否有任务，如果有则添加到当前执行栈执行，当执行完毕后再次检查，直到当前`微事件队列`为空后，再检查当前`宏事件队列`是否有任务，如果有则添加到当前执行栈执行。流程如下图所示\r\n' +
  '\r\n' +
  '![event-queue](./image/event-queue2.drawio.svg)\r\n' +
  '\r\n' +
  '&emsp;&emsp;首次执行的代码其实也是宏任务，可以这么理解，因为是首次`微事件队列`是空的所以直接执行`宏任务队列`中的任务。除了首次加载外，`微事件队列`中的任务始终是先于`宏任务队列`任务执行的。<br>\r\n' +
  '\r\n' +
  '微任务的事件包括以下几种\r\n' +
  '+ [Promise.then](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)\r\n' +
  '+ [MutaionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver)\r\n' +
  '+ [Object.observe](https://www.apiref.com/javascript-zh/Reference/Global_Objects/Object/observe.htm)(已废弃)\r\n' +
  '+ [process.nextTick](https://nodejs.org/dist/latest-v16.x/docs/api/process.html#process_process_nexttick_callback_args)(NodeJS) <br>\r\n' +
  '\r\n' +
  '宏任务的事件包括以下几种\r\n' +
  '+ [setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)\r\n' +
  '+ [setInterval](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)\r\n' +
  '+ [setImmediate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate)(非标准)\r\n' +
  '+ [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)\r\n' +
  '+ [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)\r\n' +
  '+ I/O(网页中读取文件，或NodeJS中)\r\n' +
  '+ [UI交互事件](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events#%E4%BD%BF%E7%94%A8%E7%BD%91%E9%A1%B5%E4%BA%8B%E4%BB%B6%E7%9A%84%E6%96%B9%E5%BC%8F)\r\n' +
  '\r\n' +
  '\r\n' +
  '## 思考 \r\n' +
  '请思考下面几个例子在控制台输出的顺序，最后会贴出答案。<br>\r\n' +
  '### 例子1：\r\n' +
  '```js\r\n' +
  '// 微任务\r\n' +
  'const promise = Promise.resolve()\r\n' +
  'const microtask = (cb) => {\r\n' +
  '  promise.then(cb)\r\n' +
  '}\r\n' +
  '\r\n' +
  '// 宏任务\r\n' +
  'const macrotask = (cb) => {\r\n' +
  '  setTimeout(cb)\r\n' +
  '}\r\n' +
  '\r\n' +
  'macrotask(() => {\r\n' +
  "  console.log('macrotask 1')\r\n" +
  '})\r\n' +
  '\r\n' +
  'macrotask(() => {\r\n' +
  "  console.log('macrotask 2')\r\n" +
  '})\r\n' +
  '\r\n' +
  'microtask(() => {\r\n' +
  "  console.log('microtask 1')\r\n" +
  '})\r\n' +
  '```\r\n' +
  '\r\n' +
  '### 例子2：\r\n' +
  '```js\r\n' +
  'macrotask(() => {\r\n' +
  '  microtask(() => {\r\n' +
  "    console.log('microtask 2')\r\n" +
  '  })\r\n' +
  "  console.log('macrotask 1')\r\n" +
  '})\r\n' +
  '\r\n' +
  'macrotask(() => {\r\n' +
  "  console.log('macrotask 2')\r\n" +
  '  microtask(() => {\r\n' +
  "    console.log('microtask 3')\r\n" +
  '  })\r\n' +
  '})\r\n' +
  '\r\n' +
  'microtask(() => {\r\n' +
  "  console.log('microtask 1')\r\n" +
  '})\r\n' +
  '```\r\n' +
  '下面三个例子，我大概模拟了vue2渲染函数的原理:<br>\r\n' +
  '### 例子3：\r\n' +
  '```js\r\n' +
  '/**\r\n' +
  ' * html:\r\n' +
  ' * <div id="output"></div>\r\n' +
  ' **/\r\n' +
  '\r\n' +
  'const stack = []\r\n' +
  'const nextTick = cb => microtask(cb)\r\n' +
  'const render = fn => {\r\n' +
  '  if (!stack.includes(fn)) {\r\n' +
  '    nextTick(() => {\r\n' +
  '      const index = stack.indexOf(fn)\r\n' +
  '      if (index > -1) {\r\n' +
  '        stack.splice(index, 1)\r\n' +
  '      }\r\n' +
  '      fn()\r\n' +
  '    })\r\n' +
  '    stack.push(fn)\r\n' +
  '  }\r\n' +
  '}\r\n' +
  '\r\n' +
  'const observeItem = (obj, key, val, renderFn) => {\r\n' +
  '  Object.defineProperty(obj, key, {\r\n' +
  '    set(newVal) {\r\n' +
  '      render(renderFn)\r\n' +
  '      val = newVal\r\n' +
  '      return true\r\n' +
  '    },\r\n' +
  '    get() {\r\n' +
  '      return val\r\n' +
  '    }\r\n' +
  '  })\r\n' +
  '}\r\n' +
  '\r\n' +
  'const observe = (obj, renderFn) => {\r\n' +
  '  for (let key in obj) {\r\n' +
  '    observeItem(obj, key, obj[key], renderFn)\r\n' +
  '  }\r\n' +
  '  renderFn()\r\n' +
  '}\r\n' +
  '\r\n' +
  'const data = { count: 0 }\r\n' +
  "const $container = document.querySelector('#output')\r\n" +
  '\r\n' +
  'observe(\r\n' +
  '  data, \r\n' +
  '  () => $container.textContent = data.count.toString()\r\n' +
  ')\r\n' +
  '\r\n' +
  'nextTick(() => {\r\n' +
  '  console.log($container.textContent)\r\n' +
  '})\r\n' +
  'data.count = 100\r\n' +
  '\r\n' +
  '```\r\n' +
  '### 例子4：\r\n' +
  '```js\r\n' +
  'data.count = 200\r\n' +
  'nextTick(() => {\r\n' +
  '  console.log($container.textContent)\r\n' +
  '})\r\n' +
  '```\r\n' +
  '### 例子5：\r\n' +
  '```js\r\n' +
  'macrotask(() => {\r\n' +
  '  console.log($container.textContent)\r\n' +
  '})\r\n' +
  'data.count = 300\r\n' +
  '```\r\n' +
  '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>\r\n' +
  '\r\n' +
  '### 答案\r\n' +
  '答案在下方，这里就不再解释了，记住<b>除了首次执行外微任务始终于宏任务前执行，>事件队列始终是先进先出，宏事件队列与微任务队列谁先加入谁先执行</b>，那么这些题目就难不倒你 了。\r\n' +
  '```js\r\n' +
  '// 例子1\r\n' +
  '// "microtask 1"\r\n' +
  '// "macrotask 1"\r\n' +
  '// "macrotask 2"\r\n' +
  '\r\n' +
  '// 例子2\r\n' +
  '// "microtask 1"\r\n' +
  '// "macrotask 1"\r\n' +
  '// "microtask 2"\r\n' +
  '// "macrotask 2"\r\n' +
  '// "microtask 3"\r\n' +
  '\r\n' +
  '// 例子3\r\n' +
  '// "0"\r\n' +
  '\r\n' +
  '// 例子4\r\n' +
  '// "200"\r\n' +
  '\r\n' +
  '// 例子5\r\n' +
  '// "300"\r\n' +
  '```'
})

let id = 0
const grendList = (item: any, count:number) => {
  const ret = []
  for (let i = 0; i < count; i++) {
    console.log(id)
    ret.push({...item, id: (++id), title: item.title + i})
  }

  return ret
}

const devData = {
  [getColumnList]: grendList({
    id: 1,
    title: 'HTTP/2 相关',
    desc: '随着 2015 年 5 月 14 日 HTTP/2 协议正式版的发布，越来越多的网站和第三方 CDN 服务开始启用 HTTP/2。HTTP/2 是新一代的 HTTP，也是 HTTP 的未来。本专题记录我的 HTTP/2 研究与实践。',
    articles: grendList(article(), 50)
  }, 1)
}

export default devData