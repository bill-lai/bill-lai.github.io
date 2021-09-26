import { getColumnList, getArticle } from './config'

const article = () => ({
  id: 1,
  title: 'JavaScript的宏任务与微任务',
  desc: '我们都知道JavaScript是一门单线程非阻塞的脚本语言，这意味着JavaScript在执行期间都是只有一个主线程来处理所有任务的。而非阻塞是指当代码有异步任务是，主线程会挂 起这个异步任务，当这个异步任务执行完毕后，主线程才会在适当时期去执行这个任务的回调。',
  time: new Date(),
  body: "[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)被用于许多库和浏览器框架上，例如vue3就是使用[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)来实现数据响应式的。本文带你了解[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)的用法与局限性。\r\n\r\n## Proxy参数与说明\r\n```js\r\nconst target = {}\r\nconst handler = {\r\n  get(target, key, recevier) {\r\n    return target[key]\r\n  },\r\n  set(target, key, val, recevier) {\r\n    target[key] = val\r\n    return true\r\n  }\r\n}\r\nconst proxy = new Proxy(target, handler)\r\n```\r\n### 参数\r\n+ target   需要包装的对象，可以是任何变量\r\n+ handle   代理配置，通常是用函数作为属性值的对象，为了方便表达本文以`捕捉器函数`来称呼这些属性\r\n\r\n&emsp;&emsp;对`proxy`进行操作时，如果`handler`对象中存在相应的`捕捉器函数`则运行这个函数，如果不存在则直接对`target`进行处理。<br>\r\n&emsp;&emsp;在JavaScript中对于对象的大部分操作都存在`内部方法`，它是最底层的工作方式。例如对数据读取时底层会调用`[[Get]]`，写入的时底层会调用`[[Set]]`。我们不能直接通过方法名调用它，而`Proxy`的`代理配置`中的`捕捉器函数`则可以拦截这些内部方法的调用。<br>\r\n### 内部方法与捕捉器函数\r\n下表描述了`内部方法`与`捕捉器函数`的对应关系：\r\n\r\n|  内部方法   | 捕捉器函数  | 函数参数 | 函数返回值 | 劫持 | \r\n|  ----  | ----  | ---- | ---- | --- |\r\n| `[[Get]]`  |\t`get` | `target`, `property`, `recevier` | `any` |\t读取属性  |\r\n| `[[Set]]`  |\t`set` | `target`, `property`, `value`， `recevier` | `boolean`表示操作是否 |\t写入属性  |\r\n| `[[HasProperty]]`  |\t`has` | `target`, `property` | `boolean` |\t[in 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in)  |\r\n| `[[Delete]]`  |\t`deleteProperty` | `target`, `property` | `boolean`表示操作是否 | \t[delete 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)  |\r\n| `[[Call]]`  |\t`apply` | `target`, `thisArg`, `argumentsList` | `any` |\t函数调用  |\r\n| `[[Construct]]`  |\t`construct` | `target`, `argumentsList`, `newTarget` | `object` |\t[new 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)  |\r\n| `[[GetPrototypeOf]]`  |\t`getPrototypeOf` | `target` | `object`或`null` |\t[Object.getPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)  |\r\n| `[[SetPrototypeOf]]`  |\t`setPrototypeOf` | `target`, `prototype` | `boolean`表示操作是否 |\t[Object.setPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)  |\r\n| `[[IsExtensible]]`  |\t`isExtensible` | `target` | `boolean` |\t[Object.isExtensible](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)  |\r\n| `[[PreventExtensions]]`  |\t`preventExtensions` |  `target` | `boolean`表示操作是否 |\t[Object.preventExtensions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)  |\r\n| `[[DefineOwnProperty]]`  |\t`defineProperty` | `target`, `property`, `descriptor` | `boolean`表示操作是否 |\t[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) <br>[ObjectdefineProperties](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)  |\r\n| `[[GetOwnProperty]]`  |\t`getOwnPropertyDescriptor` | `target`, `property` |  `object` 或 `undefined` | [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)<br> [for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)<br> [Object.keys](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)/[values](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values)/[entries](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) |\r\n| `[[OwnPropertyKeys]]`  |\t`ownKeys`\t| `target`  | 一个可枚举`object`. | [Object.getOwnPropertyNames](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)<br> [Object.getOwnPropertySymbols](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)<br> [for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)<br> [Object.keys](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)/[values](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values)/[entries](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) | \r\n\r\n<b>捕捉器函数参数说明</b>\r\n\r\n+ `target`  是目标对象，被作为第一个参数传递给 `new Proxy`\r\n+ `property` 将被设置或获取的属性名或 `Symbol`\r\n+ `value` 要设置的新的属性值\r\n+ `recevier` 最初被调用的对象。通常是`proxy`本身,但是可能以其他方式被间接地调用（因此不一定是`proxy`本身，后面我会说明）\r\n+ `thisArg` 被调用时的上下文对象\r\n+ `argumentsList` 被调用时的参数数组\r\n+ `newTarget` 最初被调用的构造函数\r\n+ `descriptor` 待定义或修改的属性的描述符\r\n\r\n这里我们重点讲一下捕捉器函数参数的`recevier`和`newTarget`其他参数就不一一介绍，基本上一看就懂了。\r\n\r\n## 改造console.log\r\n&emsp;&emsp;在`Proxy`的`捕捉器函数`中使用`console.log`很容易造成死循环，因为如果`console.log(poxy)`时会读取`Proxy`的属性，可能会经过`捕捉器函数`，经过`捕捉器函数`再次`console.log(poxy)`。为了方便调试，我这里改造了以下`console.log`。\r\n```js\r\n// 通过当前是否是log模式来判断是否是打印\r\nlet isLog = false\r\n{\r\n  const logs = []\r\n  const platformLog = console.log\r\n  const resolvedPromise = Promise.resolve()\r\n  // 当前是否正在执行logs\r\n  let isFlush = false\r\n\r\n  console.log = (...args) => {\r\n    logs.push(args)\r\n    isFlush || logFlush()\r\n  }\r\n\r\n  \r\n  const logFlush = () => {\r\n    isFlush = true\r\n    resolvedPromise.then(() => {\r\n      isLog = true\r\n      logs.forEach(args => {\r\n        platformLog.apply(platformLog, args)\r\n      })\r\n      logs.length = 0\r\n      isLog = false\r\n      isFlush = false\r\n    })\r\n  }\r\n}\r\n```\r\n\r\n## recevier与被代理方法上的this\r\n&emsp;&emsp;`recevier`最初被调用的对象，什么意思呢，就是谁调用的`Proxy`经过`捕捉器函数`那么它就是谁。看下方实例说明\r\n```js\r\nconst animal = {\r\n  _name: '动物',\r\n  getName() {\r\n    isLog || console.log(this)\r\n    return this._name\r\n  }\r\n}\r\n\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    isLog || console.log(recevier)\r\n    return target[key]\r\n  }\r\n})\r\n\r\n// 最初被调用的对象是animalProxy，\r\n// 这里访问时get捕捉器函数的recevier参数就是animalProxy\r\n// 被代理的this就是animalProxy\r\nanimalProxy.getName()\r\n\r\nconst pig = {\r\n  // 通过原型，继承animalProxy\r\n  __proto__: animalProxy,\r\n  test: animalProxy\r\n}\r\n\r\n// pig中不存在name，通过原型查找，原型是Proxy，读取时经过get捕捉器函数\r\n// 最初被调用的对象时pig\r\n// 这里访问时get捕捉器函数的recevier参数就是pig\r\n// 被代理的this就是pig\r\npig.getName()\r\n\r\n// 最初被调用的对象是pig.test即为animalProxy\r\n// 这里访问时get捕捉器函数的recevier参数就是animalProxy\r\n// 被代理的this就是animalProxy\r\npig.test.getName()\r\n```\r\n&emsp;&emsp;上方示例清晰的说明了`recevier`，就是当调用`proxy`对象时调用者是谁，其实与`function`中`this`的机制是一致的。\r\n## newTarget参数\r\n&emsp;&emsp;`newTarget` 最初被调用的构造函数，在`es6`中添加了[class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)对象的支持，而`newTarget`也就是主要识别类中继承关系的对象，比如看下方例子\r\n```js\r\nconst factoryClassProxy = type => \r\n  new Proxy(type, {\r\n    construct(target, args, newTarget) {\r\n      console.log(newTarget)\r\n\r\n      const instance = new target(...args)\r\n      if (target.prototype !== newTarget.prototype) {\r\n        Object.setPrototypeOf(instance, newTarget.prototype)\r\n      }\r\n      return instance\r\n    }\r\n  })\r\n\r\nconst AnimalProxy = factoryClassProxy(\r\n  class {\r\n    name = '动物'\r\n    getName() {\r\n      return this.name\r\n    }\r\n  }\r\n)\r\n\r\nconst PigProxy = factoryClassProxy(\r\n  class Animal extends AnimalProxy {\r\n    name = '猪'\r\n  }\r\n)\r\n\r\nconst PetsPigProxy = factoryClassProxy(\r\n  class Pig extends PigProxy {\r\n    name = '宠物猪'\r\n  }\r\n)\r\n\r\n// construct捕捉器函数被触发三次，\r\n// 第一次是PetsPigProxy触发       NewTarget为PetsPigProxy\r\n// 第二次是PigProxy触发           NewTarget为PetsPigProxy\r\n// 第三次是AnimalProxy触发        NewTarget为PetsPigProxy\r\nconst pig = new PetsPigProxy()\r\n```\r\n&emsp;&emsp;通过上面的例子我们可以比较清晰的知道最初被调用的构造函数的意思了，就是当外部使用`new Type()`时，无论是父类还是当前类 `construct捕捉器函数`的`newTarget`参数都是指向这个`Type`。大家注意到上方的`construct捕捉器函数`内部实现中添加了设置原型,这里涉及到`new`关键字,我们先讲讲`new`和`super`的内部工作原理\r\n<b>当用户使用`new`关键字时</b>\r\n\r\n+ 创建一个原型指向当前`class`原型的对象\r\n+ 将当前`class`构建函数的`this`指向上一步创建的对象,并执行\r\n+ 当遇到`super()`函数调用,将当前`this`指向父类构造函数并执行\r\n+ 如果父类也存在`super()`函数调用,则再次执行上一步\r\n+ `super()`执行完成,如果没有返回对象则默认返回`this`\r\n+ 将`super()`执行的结果设置为当前构造函数的`this`\r\n+ 当前`class`构造函数执行完成,如果没有返回对象则默认返回`this`\r\n\r\n&emsp;&emsp;所以当我们不指定原型的情况下,上方的代码就会丢失所有子类的`原型`,`原型`始终指向最顶级父类,因为`super`时也会调用`construct捕捉器函数`,这时`new`创建一个原型指向当前`class`原型的对象,并在返回时将子类的`this`改变为刚刚创建的对象,所以子类的`this`原型就只有父类的了。上面所使用的方法可以正常一切操作,但是这个实例终究是父级直接构造出来的，所以在构造方法中`new.target`是指向父类构造方法的，如果使用`console.log`打印出来会发现这个实例是`Animal`对象, 可能有些同学会想着这样优化,比如:\r\n\r\n```js\r\nconst factoryClassProxy = (() => {\r\n  const instanceStack = []\r\n  const getInstance = () => instanceStack[instanceStack.length - 1]\r\n  const removeInstance = () => instanceStack.pop()\r\n  const setInstance = instance => {\r\n    instanceStack.push(instance)\r\n    return instance\r\n  }\r\n\r\n  return type => \r\n    new Proxy(type, {\r\n      construct(target, args, newTarget) {\r\n        const isCurrent = target.prototype === newTarget.prototype\r\n        const currentInsetance = isCurrent\r\n          ? setInstance(Object.create(target.prototype))\r\n          : getInstance()\r\n\r\n        if (currentInsetance) {\r\n          target.apply(currentInsetance, args)\r\n          removeInstance()\r\n          return currentInsetance\r\n        } else {\r\n          return new target(...args)\r\n        }\r\n      }\r\n    })\r\n})();\r\n```\r\n&emsp;&emsp;但是很遗憾`class`的构造函数加了限制,在`class`构造期间会通过[new.target](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)检查当前是否是通过`new`关键字调用，`class`仅允许`new`关键字调用, 直接通过函数式调用会报错,所以这种方法也无效,目前我没找到其他方法,如果各位大神有方法麻烦评论区贴一下谢谢了。有个最新的对象可以解决这个问题就是`Reflect`这一块我们后面再整体讲一讲。\r\n\r\n## 代理具有私有属性的对象\r\n&emsp;&emsp;类属性在默认情况下是公共的，可以被外部类检测或修改。在[ES2020](https://github.com/tc39/proposal-class-fields) 实验草案 中，增加了定义[私有类字段](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Private_class_fields)的能力，写法是使用一个`#`作为前缀。我们将上面的示例改造成类写法,先改造`Animal`对象如下:\r\n\r\n```js\r\nclass Animal {\r\n  #name = '动物'\r\n  getName() {\r\n    isLog || console.log(this)\r\n    return this.#name\r\n  }\r\n}\r\n\r\nconst animal = new Animal()\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    return target[key]\r\n  },\r\n  set(target, key, value, recevier) {\r\n    target[key] = value\r\n  }\r\n})\r\n// TypeError: Cannot read private member #name from an object whose class did not declare it\r\nconsole.log(animalProxy.getName())\r\n```\r\n&emsp;&emsp;上面代码直接运行报错了,为什么呢,我们通过[recevier与被代理方法上的this](#recevier与被代理方法上的this)得知在运行`animalProxy.getName()`时`getName`方法的`this`是指向`animalProxy`的,而`私有成员`是不允许外部访问的,访问时会直接报错,我们需要将`this`改成正确的指向,如下:\r\n```js\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    const value = target[key]\r\n    return typeof value === 'function'\r\n      ? value.bind(target)\r\n      : value\r\n  },\r\n  ...\r\n})\r\n// 动物\r\nconsole.log(animalProxy.getName())\r\n```\r\n## 代理具有内部插槽的内建对象\r\n&emsp;&emsp;有许多的`内建对象`比如`Map`，`Set`，`Date`，`Promise`都使用了`内部插槽`，`内部插槽`类似于上面的对象的私有属性，不允许外部访问，所以当代理没做处理时，直接代理他们会发生错误例如：\r\n```js\r\n\r\nconst factoryInstanceProxy = instance => \r\n  new Proxy(instance, {\r\n    get(target, prop) {\r\n      return target[prop]\r\n    },\r\n    set(target, prop, val) {\r\n      target[prop] = val\r\n      return true\r\n    }\r\n  })\r\n\r\n// TypeError: Method Map.prototype.set called on incompatible receiver #<Map>\r\nconst map = factoryInstanceProxy(new Map())\r\nmap.set(0, 1)\r\n\r\n//  TypeError: this is not a Date object.\r\nconst date = factoryInstanceProxy(new Date())\r\ndate.getTime()\r\n\r\n// Method Promise.prototype.then called on incompatible receiver #<Promise>\r\nconst resolvePromise = factoryInstanceProxy(Promise.resolve())\r\nresolvePromise.then()\r\n\r\n// TypeError: Method Set.prototype.add called on incompatible receiver #<Set>\r\nconst set = factoryInstanceProxy(new Set())\r\nset.add(1)\r\n```\r\n在上方访问时`this`都是指向`Proxy`的，而内部插槽只允许内部访问，`Proxy`中没有这个内部插槽属性，所以只能失败，要处理这个问题可以像[代理具有私有属性的对象](#代理具有私有属性的对象)中一样的方式处理，将`function`的`this`绑定,这样访问时就能正确的找到内部插槽了。\r\n```js\r\nconst factoryInstanceProxy = instance => \r\n  new Proxy(instance, {\r\n    get(target, prop) {\r\n      const value = target[key]\r\n      return typeof value === 'function'\r\n        ? value.bind(target)\r\n        : value\r\n    }\r\n    ...\r\n  })\r\n```\r\n\r\n## ownKeys捕捉器函数\r\n&emsp;&emsp;可能有些同学会想，为什么要把`ownKeys捕捉器`单独拎出来说呢，这不是一看就会的吗？别着急，大家往下看，里面还是有一个需要注意的知识点的。我们看这样一个例子：\r\n```js\r\nconst user = {\r\n  name: 'bill',\r\n  age: 29,\r\n  sex: '男',\r\n  // _前缀识别为私有属性，不能访问，修改\r\n  _code: '44xxxxxxxxxxxx17'\r\n}\r\n\r\nconst isPrivateProp = prop => prop.startsWith('_')\r\n\r\nconst userProxy = new Proxy(user, {\r\n  get(target, prop) {\r\n    return !isPrivateProp(prop)\r\n      ? target[prop]\r\n      : null\r\n  },\r\n  set(target, prop, val) {\r\n    if (!isPrivateProp(prop)) {\r\n      target[prop] = val\r\n      return true\r\n    } else {\r\n      return false\r\n    }\r\n  },\r\n  ownKeys(target) {\r\n    return Object.keys(target)\r\n      .filter(prop => !prop.startsWith('_'))\r\n  }\r\n})\r\n\r\nconsole.log(Object.keys(userProxy))\r\n\r\n```\r\n&emsp;&emsp;不错一切都预期运行，这时候产品过来加了个需求，根据身份证的前两位自动识别当前用户所在的省份，脑袋瓜子一转，直接在代理处识别添加不就好了，我们来改一下代码\r\n```js\r\n// 附加属性列表\r\nconst provinceProp = 'province'\r\n// 附加属性列表\r\nconst attach = [ provinceProp ]\r\n\r\n// 通过code获取省份方法\r\nconst getProvinceByCode = (() => {\r\n  const codeMapProvince = {\r\n    '44': '广东省'\r\n    ...\r\n  }\r\n  return code => codeMapProvince[code.substr(0, 2)]\r\n})()\r\n\r\n\r\nconst userProxy = new Proxy(user, {\r\n  get(target, prop) {\r\n    let value = null\r\n\r\n    switch(prop) {\r\n      case provinceProp: \r\n        value = getProvinceByCode(target._code)\r\n        break;\r\n      default:\r\n        value = isPrivateProp(prop) ? null : target[prop]\r\n    }\r\n    \r\n    return value\r\n  },\r\n  set(target, prop, val) {\r\n    if (isPrivateProp(prop) || attach.includes(prop)) {\r\n      return false\r\n    } else {\r\n      target[prop] = val\r\n      return true\r\n    }\r\n  },\r\n  ownKeys(target) {\r\n    return Object.keys(target)\r\n      .filter(prop => !prop.startsWith('_'))\r\n      .concat(attach)\r\n  }\r\n})\r\n\r\n\r\nconsole.log(userProxy.province)       // 广东省\r\nconsole.log(Object.keys(userProxy))   // [\"name\", \"age\", \"sex\"]\r\n```\r\n&emsp;&emsp;可以看到对代理的附加属性直接访问是正常的，但是使用`Object.keys`获取属性列表的时候只能列出`user`对象原有的属性，问题出在哪里了呢？<br>\r\n&emsp;&emsp;这是因为`Object.keys`会对每个属性调用内部方法`[[GetOwnProperty]]`获取它的`属性描述符`，返回自身带有`enumerable（可枚举）`的非`Symbol`的`key`。`enumerable`是从对象的`属性的描述符`中获取的，在上面的例子中`province`没有`属性的描述符`也就没有`enumerable`属性了，所以`province`会被忽略<br>\r\n&emsp;&emsp;要解决这个问题就需要为`province`添加属性描述符，而通过我们上面[内部方法与捕捉器函数表](#内部方法与捕捉器函数)知道`[[GetOwnProperty]]`获取时会通过`getOwnPropertyDescriptor`捕捉器函数获取，我们加个这个捕捉器函数就可以解决了。\r\n```js\r\n\r\nconst userProxy = new Proxy(user, {\r\n  ...\r\n  getOwnPropertyDescriptor(target, prop) {\r\n    return attach.includes(prop)\r\n      ? { configurable: true, enumerable: true }\r\n      : Object.getOwnPropertyDescriptor(target, prop)\r\n  }\r\n})\r\n\r\n// [\"name\", \"age\", \"sex\", \"province\"]\r\nconsole.log(Object.keys(userProxy))\r\n```\r\n&emsp;&emsp;注意`configurable`必须为`true`，因为如果是不可配置的，`Proxy`会阻止你为该属性的描述符代理。\r\n\r\n## Reflect\r\n&emsp;&emsp;在上文[newTarget参数](#newTarget参数)中我们使用了不完美的`construct捕捉器`处理函数，在创建子类时会多次`new`父类对象，而且最终传出的也是顶级父类的对象，在`console.log`时可以看出。其实`Proxy`有一个最佳搭档，可以完美处理，那就是[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)。<br>\r\n&emsp;&emsp;`Reflect` 是一个`内置的对象`，它提供拦截 JavaScript 操作的方法。这些方法与`Proxy捕捉器`的方法相同。所有`Proxy捕捉器`都有对应的`Reflect`方法，而且`Reflect`不是一个函数对象，因此它是不可构造的，我们可以像使用`Math`使用他们比如`Reflect.get(...)`，除了与`Proxy捕捉器`一一对应外，`Reflect`方法与`Object`方法也有大部分重合，大家可以通过这里，[比较 Reflect 和 Object 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)。\r\n\r\n下表描述了`Reflect`与`捕捉器函数`的对应关系，而对应的`Reflect`参数与`捕捉器函数`大部分，参考[内部方法与捕捉器函数](#内部方法与捕捉器函数)\r\n\r\n\r\n | 捕捉器函数                 | Reflect对应方法                    | 方法参数 | 方法返回值  |\r\n | -------------------------- | ---------------------------------- | --| --|\r\n | `get`                      | [Reflect.get()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get)                      | `target`, `property`, `recevier`  | 属性的值 |\r\n | `set`                      | [Reflect.set()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set)                      | `target`, `property`, `value`， `recevier`  | `Boolean` 值表明是否成功设置属性。|\r\n | `has`                      | [Reflect.has()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has)                      | `target`, `property` | `Boolean` 类型的对象指示是否存在此属性。 |\r\n | `deleteProperty`           | [Reflect.deleteProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/deleteProperty)           | `target`, `property` | `Boolean` 值表明该属性是否被成功删除 |\r\n | `apply`                    | [Reflect.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)                    | `target`, `thisArg`, `argumentsList` |  调用完带着指定参数和 `this` 值的给定的函数后返回的结果。|\r\n | `construct`                | [Reflect.construct()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct)                | `target`, `argumentsList`, `newTarget` | `target`（如果`newTarget`存在，则为`newTarget`）为原型，调用`target`函数为构造函数,`argumentList`为其初始化参数的对象实例。 |\r\n | `getPrototypeOf`           | [Reflect.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf)           | `target` | 给定对象的原型。如果给定对象没有继承的属性，则返回 `null`。 |\r\n | `setPrototypeOf`           | [Reflect.setPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/setPrototypeOf)           | `target`, `prototype` |  `Boolean` 值表明是否原型已经成功设置。 |\r\n | `isExtensible`             | [Reflect.isExtensible()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/isExtensible)             |  `target` | `Boolean` 值表明该对象是否可扩展 | \r\n | `preventExtensions`        | [Reflect.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/preventExtensions)        |  `target` |  `Boolean` 值表明目标对象是否成功被设置为不可扩展 |\r\n | `getOwnPropertyDescriptor` | [Reflect.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getOwnPropertyDescriptor) |  `target`, `property` | 如果属性存在于给定的目标对象中，则返回属性描述符；否则，返回 `undefined`。 |\r\n | `ownKeys`                  | [Reflect.ownKeys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)                  | `target` | 由目标对象的自身属性键组成的 `Array`。 |\r\n\r\n### Reflect的recevier参数\r\n\r\n&emsp;&emsp;当使用`Reflect.get`或者`Reflect.set`方法时会有可选参数`recevier`传入，这个参数时使用`getter`或者`setter`时可以改变`this`指向使用的，如果不使用`Reflect`时我们是没办法改变`getter`或者`setter`的`this`指向的因为他们不是一个方法，参考下方示例：\r\n\r\n```js\r\nconst user = {\r\n  _name: '进餐小能手',\r\n  get name() {\r\n    return this._name\r\n  },\r\n  set name(newName) {\r\n    this._name = newName\r\n    return true\r\n  }\r\n}\r\nconst target = {\r\n  _name: 'bill'\r\n}\r\nconst name = Reflect.get(user, 'name', target)\r\n// bill\r\nconsole.log(name)\r\n\r\nReflect.set(user, 'name', 'lzb', target)\r\n// { _name: 'lzb' }\r\nconsole.log(target)\r\n// { _name: '进餐小能手' }\r\nconsole.log(user)\r\n```\r\n\r\n### Reflect的newTarget参数\r\n\r\n&emsp;&emsp;当使用`Reflect.construct`时会有一个可选参数`newTarget`参数可以传入，`Reflect.construct`是一个能够`new Class`的方法实现，比如`new User('bill')`与`Reflect.construct(User, ['bill'])`是一致的，而`newTarget`可以改变创建出来的对象的原型，在`es5`中能够用`Object.create`实现，但是有略微的区别，在构造方法中`new.target`可以查看到当前构造方法，如果使用`es5`实现的话这个对象是`undefined`因为不是通过`new`创建的，使用`Reflect.construct`则没有这个问题 参考下方两种实现方式\r\n\r\n```js\r\nfunction OneClass() {\r\n  console.log(new.target)\r\n  this.name = 'one';\r\n}\r\n\r\nfunction OtherClass() {\r\n  console.log(new.target)\r\n  this.name = 'other';\r\n}\r\n\r\n// 创建一个对象:\r\nvar obj1 = Reflect.construct(OneClass, args, OtherClass);\r\n// 打印 function OtherClass\r\n\r\n// 与上述方法等效:\r\nvar obj2 = Object.create(OtherClass.prototype);\r\nOneClass.apply(obj2, args);\r\n// 打印 undefined\r\n\r\nconsole.log(obj1.name); // 'one'\r\nconsole.log(obj2.name); // 'one'\r\n\r\nconsole.log(obj1 instanceof OneClass); // false\r\nconsole.log(obj2 instanceof OneClass); // false\r\n\r\nconsole.log(obj1 instanceof OtherClass); // true\r\nconsole.log(obj2 instanceof OtherClass); // true\r\n``` \r\n\r\n## construct捕捉器\r\n&emsp;&emsp;在[newTarget参数](#newTarget参数)中我们实现了不完美的`construct捕捉器`，而通过阅读[Reflect](#Reflect)，我们知道了一个能够完美契合我们想要的能够实现的方案，那就是`Reflect.construct`不仅能够识别`new.target`，也能够处理多是创建对象问题，我们改造一下实现，示例如下\r\n```js\r\n\r\nconst factoryClassProxy = type => \r\n  new Proxy(type, {\r\n    construct(target, args, newTarget) {\r\n      return Reflect.construct(...arguments)\r\n    }\r\n  })\r\n\r\nconst AnimalProxy = factoryClassProxy(\r\n  class {\r\n    name = '动物'\r\n    getName() {\r\n      return this.name\r\n    }\r\n  }\r\n)\r\n\r\nconst PigProxy = factoryClassProxy(\r\n  class Animal extends AnimalProxy {\r\n    name = '猪'\r\n  }\r\n)\r\n\r\nconst PetsPigProxy = factoryClassProxy(\r\n  class Pig extends PigProxy {\r\n    name = '宠物猪'\r\n  }\r\n)\r\n```\r\n\r\n## 代理setter、getter函数 \r\n&emsp;&emsp;我们通过阅读[recevier与被代理方法上的this](#recevier与被代理方法上的this)知道了`recevier`的指向,接下来请思考这样一段代码\r\n\r\n```js\r\nconst animal = {\r\n  _name: '动物',\r\n  getName() {\r\n    return this._name\r\n  },\r\n  get name() {\r\n    return this._name\r\n  }\r\n}\r\n\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    return target[key]\r\n  }\r\n})\r\n\r\n\r\nconst pig = {\r\n  __proto__: animalProxy,\r\n  _name: '猪'\r\n}\r\n\r\nconsole.log(pig.name)\r\nconsole.log(animalProxy.name)\r\nconsole.log(pig.getName())\r\nconsole.log(animalProxy.getName())\r\n```\r\n&emsp;&emsp;如果你运行上方代码会发现打印顺序依次是`动物，动物，猪，动物`，使用`getName`通过方法访问时是没问题的，因为代理拿到了`getName`的实现，然后通过当前对象访问，所以`this`是当前谁调用就是谁,但是通过`getter`调用时，在通过`target[key]`时就已经调用了方法实现，所以`this`始终是指向当前代理的对象`target`，想要修正这里就得通过代理内的`捕捉器`入手，修正`this`的对象，而`recevier`就是指向当前调用者的，但是`getter`不像成员方法可以直接通过`bind、call、apply`能够修正`this`，这时候我们就要借助`Reflect.get`方法了。`setter`的原理也是一样的这里就不作多讲了，参考下方\r\n\r\n```js\r\nconst animal = {\r\n  _name: '动物',\r\n  getName() {\r\n    return this._name\r\n  },\r\n  get name() {\r\n    return this._name\r\n  }\r\n}\r\n\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    return Reflect.get(...arguments)\r\n  }\r\n})\r\n\r\n\r\nconst pig = {\r\n  __proto__: animalProxy,\r\n  _name: '猪'\r\n}\r\n\r\nconsole.log(pig.name)\r\nconsole.log(animalProxy.name)\r\nconsole.log(pig.getName())\r\nconsole.log(animalProxy.getName())\r\n```\r\n\r\n## Proxy与Reflect的结合\r\n&emsp;&emsp;因为`Reflect`与`Proxy`的`捕捉器`都有对应的方法，所以大部分情况下我们都能直接使用`Reflect`的`API`来对`Proxy`的操作相结合。我们能专注`Proxy`要执行的业务比如下方代码\r\n\r\n```js\r\nnew Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    // 具体业务\r\n    ...\r\n    return Reflect.get(...arguments)\r\n  },\r\n  set(target, property, value, recevier) {\r\n    // 具体业务\r\n    ...\r\n    return Reflect.set(...arguments)\r\n  },\r\n  has(target, property) {\r\n    // 具体业务\r\n    ...\r\n    return Reflect.has(...arguments)\r\n  }\r\n  ...\r\n})\r\n```\r\n\r\n## Proxy.revocable撤销代理\r\n&emsp;&emsp;假如有这么一个业务，我们在做一个商城系统，产品要求跟踪用户的商品内操作的具体踪迹，比如展开了商品详情，点击播放了商品的视频等等，为了与具体业务脱耦，使用`Proxy`是一个不错的选择于是我们写了下面这段代码\r\n```js\r\n// track-commodity.js\r\n// 具体的跟踪代码\r\nconst track = {\r\n  // 播放了视频\r\n  introduceVideo() {\r\n    ...\r\n  },\r\n  // 获取了商品详情\r\n  details() {\r\n    ...\r\n  }\r\n}\r\n\r\nexport const processingCommodity = (commodity) => \r\n  new Proxy(commodity, {\r\n    get(target, key) {\r\n      if (track[key]) {\r\n        track[key]()\r\n      }\r\n      return Reflect.get(...arguments)\r\n    }\r\n  })\r\n  \r\n// main.js\r\n// 具体业务中使用\r\ncommodity = processingCommodity(commodity)\r\n```\r\n&emsp;&emsp;我们编写了上方，不错很完美，但是后期一堆客户反应不希望自己的行踪被跟踪，产品又要求我们改方案，用户可以在设置中要求不跟踪，不能直接重启刷新页面，也不能让缓存中的商品对象重新加载这时候，如果让新的商品不被代理很简单只要加个判断就行了，但是旧数据也不能重新加载，那就只能撤销代理了，接下来我们介绍一下新的API<br>\r\n&emsp;&emsp;[Proxy.revocable(target, handler)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable)方法可以用来创建一个可撤销的代理对象。该方法的参数与`new Proxy(target, handler)`一样，第一个参数传入要代理的对象，第二个参数传入`捕捉器`。该方法返回一个对象，这个对象的`proxy`返回`target`的代理对象，`revoke`返回撤销代理的方法，具体使用如下\r\n```js\r\nconst { proxy, revoke } = Proxy.revocable(target, handler)\r\n```\r\n&emsp;&emsp;接下来我们改进一下我们的跟踪代码，如下\r\n```js\r\n// track-commodity.js\r\n...\r\n\r\n// 为什么使用 WeakMap 而不是 Map，因为它不会阻止垃圾回收。\r\n// 如果商品代理除了WeakMap之外没有地方引用，则会从内存中清除\r\nconst revokes = new WeakMap()\r\nexport const processingCommodity = (commodity) => {\r\n  const { proxy, revoke } = Proxy.revocable(commodity, {\r\n    get(target, key) {\r\n      if (track[key]) {\r\n        track[key]()\r\n      }\r\n      return Reflect.get(...arguments)\r\n    }\r\n  })\r\n\r\n  revokes.set(proxy, revoke)\r\n\r\n  return proxy\r\n}\r\nexport const unProcessingCommodity = (commodity) => {\r\n  const revoke = revokes.get(commodity)\r\n  if (revoke) {\r\n    revoke()\r\n  } else {\r\n    return commodity\r\n  }\r\n}\r\n\r\n// main.js\r\n// 查看是否设置了可跟踪\r\nconst changeCommodity = () => \r\n  commodity = setting.isTrack\r\n    ? processingCommodity(commodity)\r\n    : unProcessingCommodity(commodity)\r\n\r\n// 初始化\r\nchangeCommodity()\r\n// 监听设置改变\r\nbus.on('changeTrackSetting', changeCommodity)\r\n```\r\n&emsp;&emsp;还有一个问题，我们看到当`revoke()`撤销代理后我们并没有返回代理前的`commodity`对象，这该怎么办呢，怎么从代理处拿取代理前的对象呢，我认为比较好的有两种方案，我们往下看。\r\n## 通过代理获取被代理对象\r\n&emsp;&emsp;通过代理处拿取代理前的对，我认为有两种比较好的方案我分别介绍一下。<br>\r\n&emsp;&emsp;1：[Proxy.revocable撤销代理](#Proxy.revocable撤销代理)中实例看到，我们既然添加了`proxy`与`revoke`的`WeakMap`对象，为什么不多添加一份`proxy`与`target`的对象呢，说说干就干\r\n```js\r\n...\r\nconst commoditys = new WeakMap()\r\nconst revokes = new WeakMap()\r\nconst processingCommodity = (commodity) => {\r\n  const { proxy, revoke } = Proxy.revocable(commodity, {\r\n    get(target, key) {\r\n      if (track[key]) {\r\n        track[key]()\r\n      }\r\n      return Reflect.get(...arguments)\r\n    }\r\n  })\r\n\r\n  commoditys.set(proxy, commodity)\r\n  revokes.set(proxy, revoke)\r\n  \r\n  return proxy\r\n}\r\nconst unProcessingCommodity = (commodity) => {\r\n  const revoke = revokes.get(commodity)\r\n  if (revoke) {\r\n    revoke()\r\n    return commoditys.get(commodity)\r\n  } else {\r\n    return commodity\r\n  }\r\n}\r\n```\r\n&emsp;&emsp;2：与第一种方案不同，第二种方案是直接在代理的`get捕捉器`中加入逻辑处理，既然我们能够拦截`get`，那我们就能够在里面添加一些我们`track-commodity.js`的内置逻辑，就是当`get`某个`key`时我们就返回代理的原始对象，当然这个`key`不能和业务中使用到的`commodity`的`key`冲突，而且要确保只有内部使用，所以我们需要使用到[Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)，只要不导出用户就拿不到这个`key`就都解决了，参考下方代码\r\n```js\r\n...\r\nconst toRaw = Symbol('getCommodity')\r\nconst revokes = new WeakMap()\r\nconst processingCommodity = (commodity) => {\r\n  const { proxy, revoke } = Proxy.revocable(commodity, {\r\n    get(target, key) {\r\n      if (key === toRaw) {\r\n        return target\r\n      }\r\n      if (track[key]) {\r\n        track[key]()\r\n      }\r\n      return Reflect.get(...arguments)\r\n    }\r\n  })\r\n  revokes.set(proxy, revoke)\r\n  \r\n  return proxy\r\n}\r\nconst unProcessingCommodity = (commodity) => {\r\n  const revoke = revokes.get(commodity)\r\n  if (revoke) {\r\n    // 注意要在撤销代理前使用\r\n    const commodity = commodity[toRaw]\r\n    revoke()\r\n    return commodity\r\n  } else {\r\n    return commodity\r\n  }\r\n}\r\n```\r\n## Proxy的局限性\r\n&emsp;&emsp;代理提供了一种独特的方法，可以在调整现有对象的行为，但是它并不完美，有一定的局限性。\r\n### 代理私有属性\r\n&emsp;&emsp;我们在[代理具有私有属性的对象](#代理具有私有属性的对象)时介绍了如何避开`this`是当前代理无法访问私有属性的问题，但是这里也有一定的问题，因为一个对象里肯定不止只有访问私有属性的方法，如果有访问自身非私有属性时，这里的处理方式有一定的问题，比如下方代码\r\n```js\r\n\r\nclass Animal {\r\n  #name = '动物'\r\n  feature = '它们一般以有机物为食，能感觉，可运动，能够自主运动。活动或能够活动之物'\r\n  getName() {\r\n    return this.#name\r\n  }\r\n  getFeature() {\r\n    return this.feature\r\n  }\r\n}\r\n\r\nconst animal = new Animal()\r\n\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    const value = Reflect.get(...arguments)\r\n    return typeof value === 'function'\r\n      ? value.bind(target)\r\n      : value\r\n  }\r\n})\r\n\r\nconst pig = {\r\n  __proto__: animalProxy,\r\n  feature: '猪是一种脊椎动物、哺乳动物、家畜，也是古杂食类哺乳动物，主要分为家猪和野猪'\r\n}\r\n\r\n// 动物\r\nconsole.log(pig.getName())\r\n// 它们一般以有机物为食，能感觉，可运动，能够自主运动。活动或能够活动之物\r\nconsole.log(pig.getFeature())\r\n```\r\n&emsp;&emsp;因为只要是`function`都会执行`bind`绑定当前被代理的对象`animal`，所以当`pig`通过原型继承了`animalProxy`之后`this`访问的都是`animal`，还有，这意味着我们要熟悉被代理对象内的`api`，通过识别是否是私有属性访问才绑定`this`，需要了解被代理对象的`api`。还有一个问题是私有属性只允许自身访问，在没有代理的帮助下上方的`pig.getName()`会出错`TypeError`，而通过`bind`之后就可以正常访问，这一块要看具体业务，不过还是建议跟没代理时保持一致，这里处理比较简单，在知道使用私有属性`api`之后，只要识别当前访问对象是否是原对象的代理即可。具体处理代码下方所示\r\n```js\r\nconst targets = new WeakMap()\r\nconst privateMethods = ['getName']\r\nconst animalProxy = new Proxy(animal, {\r\n  get(target, key, recevier) {\r\n    const isPrivate = privateMethods.includes(key) \r\n    if (isPrivate && targets.get(recevier) !== target) {\r\n      throw `${key}方法仅允许自身调用`\r\n    }\r\n    \r\n    const value = Reflect.get(...arguments)\r\n    if (isPrivate && typeof value === 'function') {\r\n      return value.bind(target)\r\n    } else {\r\n      return value\r\n    }\r\n  }\r\n})\r\ntargets.set(animalProxy, animal)\r\n\r\nconst pig = {\r\n  __proto__: animalProxy,\r\n  feature: '猪是一种脊椎动物、哺乳动物、家畜，也是古杂食类哺乳动物，主要分为家猪和野猪'\r\n}\r\n\r\n// 动物\r\nconsole.log(animalProxy.getName())\r\n// TypeError\r\n// console.log(pig.getName())\r\n// 猪是一种脊椎动物、哺乳动物、家畜，也是古杂食类哺乳动物，主要分为家猪和野猪\r\nconsole.log(pig.getFeature())\r\n```\r\n### target !== Proxy\r\n&emsp;&emsp;代理跟原对象肯定是不同的对象，所以当我们使用原对象进行管理后代理却无法进行正确管理，比如下方代理做了一个所有用户实例的集中管理：\r\n```js\r\nconst users = new Set()\r\nclass User {\r\n  constructor() {\r\n    users.add(this)\r\n  }\r\n}\r\n\r\nconst user = new User()\r\n// true\r\nconsole.log(users.has(user))\r\nconst userProxy = new Proxy(user, {})\r\n// false\r\nusers.has(userProxy)\r\n```\r\n&emsp;&emsp;所以在开发中这类问题需要特别注意，在开发时假如对一个对象做代理时，对代理的所有管理也需要再进行一层代理，原对象对原对象，代理对代理，比如上方这个实例可以通过下方代码改进\r\n\r\n```js\r\n\r\nconst users = new Set()\r\nclass User {\r\n  constructor() {\r\n    users.add(this)\r\n  }\r\n}\r\n\r\n// 获取原对象\r\nconst getRaw = (target) => target[toRaw] ? target[toRaw] : target\r\nconst toRaw = Symbol('toRaw')\r\nconst usersProxy = new Proxy(users, {\r\n  get(target, prop) {\r\n    // 注意Set size是属性，而不是方法，这个属性用到了内部插槽，\r\n    // 所以不能够使用Reflect.get(...arguments)获取\r\n    let value = prop === 'size' \r\n      ? target[prop]\r\n      : Reflect.get(...arguments)\r\n\r\n    value = typeof value === 'function'\r\n      ? value.bind(target)\r\n      : value\r\n\r\n    // 这里只做两个api示例，当添加或者判断一定是通过原对象判断添加，\r\n    // 因为原对象的管理只能放原对象\r\n    if (prop === 'has' || prop === 'add') {\r\n      return (target, ...args) => \r\n        value(getRaw(target), ...args)\r\n    } else {\r\n      return value\r\n    }\r\n  }\r\n})\r\n\r\nconst factoryUserProxy = (user) => {\r\n  const userProxy = new Proxy(user, {\r\n    get(target, prop, recevier) {\r\n      if (prop === toRaw) {\r\n        return target\r\n      } else {\r\n        return Reflect.get(...arguments)\r\n      }\r\n    }\r\n  })\r\n  return userProxy\r\n}\r\n\r\n\r\nconst user = new User()\r\nconst userProxy = factoryUserProxy(user)\r\n// true\r\nconsole.log(users.has(user))\r\n// true\r\nconsole.log(usersProxy.has(user))\r\n// true\r\nconsole.log(usersProxy.has(userProxy))\r\n// true\r\nconsole.log(users.size)\r\n// true\r\nconsole.log(usersProxy.size)\r\n// 因为会转化为原对象添加，而原对象已有 所以添加不进去\r\nusersProxy.add(userProxy)\r\n// 1\r\nconsole.log(users.size)\r\n// 1\r\nconsole.log(usersProxy.size)\r\n```\r\n&emsp;&emsp;`Proxy`就介绍到这里了，本文介绍了`Proxy`大部分要注意的问题以及用法。"
})

let id = 0
const grendList = (item: any, count:number) => {
  const ret = []
  for (let i = 0; i < count; i++) {
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
  }, 1),
  [getArticle]: article()
}

export default devData