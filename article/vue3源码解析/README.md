>注意：本文阅读使用的版本是VUE3.0.7，如果当你阅读时版本发生重大改变，版本不一致可能会对实现和源码理解产生不一致，欢迎大家再评论区指出。

## 阅读准备
克隆[vue3源码](https://github.com/vuejs/vue-next)，vue3是使用[yarn](https://yarnpkg.com/)来安装依赖包，所以我们需要安装[yarn](https://yarnpkg.com/)


```js
// 使用管理员身份运行
npm install -g yarn
// 进入Vue3源码目录
cd vue-next
// 安装依赖包
yarn install
```
本系列文章阅读的目录位于vue-next>packages>reactivity,大家可以看到里面的__tests__,里面有许多测试用例，本系列将从单例入手，先从上层一步步往下阅读，[Vue3](https://vue3js.cn/docs/zh/)测试用例是使用[jest](https://jestjs.io/zh-Hans/)编写的，所以我们需要安装一个能直接运行单例的插件，作者使用的编辑器是 [vscode](https://code.visualstudio.com/)，[vscode](https://code.visualstudio.com/)可以直接下载`jest runner`插件，然后直接在`__test__`目录里的测试用例上点`Run`可以直接运行测试用例，`debugger`按钮可以直接在[vscode](https://code.visualstudio.com/)里面调试。<br>

因为作者阅读过源码，大概知道流程，建议阅读顺序 reactive -> reactiveArray -> shallowReactive -> ref ->  effect -> computed -> readonly -> collections

