什么是标志？标志就是显示事物特征，便于识别的记号。在程序中我们通常使用枚举来表示标志，比如权限标志：
```js
// authorityFlag.js

// 是否有查询权限
const QUERY = 1
// 是否有更新权限
const UPDATE = 2
// 是否有删除权限
const DELETE = 3
// 是否有新增权限
const INSERT = 4
```
以往我们通常是使用数组来这这类标志管理的
```js
// 用户拥有的权限
const userAuths = [QUERY, UPDATE, INSERT]

// 是否包含权限
const containFlag = (auths, [...flags]) => 
  flags.every(flag => auths.includes(flag))

// 是否没有权限
const noContainFlag = (auths, [...flags]) =>
  flags.every(flag => !auths.includes(flag))

// 是否只有某个权限
const equalFlag = (auths, flag) =>
  flags.length === 1 && flags[0] === flag

// 添加权限
const addFlag = (auths, [...flags]) => {
  flags.forEach(flag => {
    if (!containFlag(flag)) {
      auths.push(flag)
    }
  })
}

// 删除权限
const removeFlag = (auths, [...flags]) => {
  flags.forEach(flag => {
    const index = flags.indexOf(flag)
    if (index > -1) {
      flags.splice(index, 1)
    }
  })
}
```
现在我给大家分享使用[左移(>>)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Left_shift)、[按位或(|)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)、[按位与(&)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)、[按位或(|)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_OR)、[按位非(~)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)四种操作符结合做标志管理的方法

## 左移(>>)
左移操作符 (<<) 将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零。比如：
```js
const numToBinaryString = 
  num => console.log(num.toString(2))

numToBinaryString(5);       // 00000000000000000000000000000101
numToBinaryString(5 << 2);  // 00000000000000000000000000010100
numToBinaryString(5 << 3);  // 00000000000000000000000000101000
```

## 按位或(|)
按位或运算符 (|) 其中一个操作数或两个都是 1，则这个位上返回 1 。可以看作每个操作数的||操作符比较好理解，比如：
```js
numToBinaryString(5);       // 00000000000000000000000000000101
numToBinaryString(3);       // 00000000000000000000000000000011
numToBinaryString(5 | 3);   // 00000000000000000000000000000111
```

## 按位与(&)
按位与运算符 (&) 两个操作数对应的位都是 1，则这个位上返回 1 。可以看作每个操作数的&&操作符比较好理解，比如：
```js
numToBinaryString(5);       // 00000000000000000000000000000101
numToBinaryString(3);       // 00000000000000000000000000000011
numToBinaryString(5 & 3);   // 00000000000000000000000000000001
```

## 按位非 (~)
按位非运算符（~），反转操作数的位。可以看作所有位数1 0 反转,比如:
```js
numToBinaryString(5);       // 00000000000000000000000000000101
numToBinaryString(~5);      // 11111111111111111111111111111010
```

## 使用 >>、 |、 &、 ~ 做标志管理
因为三个运算符的特殊关系，所以我们需要在二进制数中，每个状态都只有一个位数是1，且不能相同，如下
```js
// before
const QUERY = 1
const UPDATE = 2
const DELETE = 3
const INSERT = 4

// after                
const QUERY = 1         // 00000000000000000000000000000001
const UPDATE = 1 << 2   // 00000000000000000000000000000010
const DELETE = 1 << 3   // 00000000000000000000000000000100
const INSERT = 1 << 4   // 00000000000000000000000000001000
```
那是如何管理这些标志的呢，相信你已经聪明的你猜到了，

### 拼合多个标志
因为 `按位或(|)` 的特性，我们可以将拥有的标志的位数都联合起来
```js
// before
const userAuths = [QUERY, UPDATE, INSERT]

//after
const userAuths = QUERY | UPDATE | INSERT   // 00000000000000000000000000001011
```

### 是否包含
因为 `按位与(&)` 的特性，我们可以单独判断是否拥有某个标志，因为只有两个位数都为1才会为1,只要结果不为0即为存在
```js
// before
const containFlag = (auths, [...flags]) => 
  flags.every(flag => auths.includes(flag))

//after
const containFlag = (auths, [...flags]) =>
  flags.every(flag => auths & flag)
/**
 * 比如 auths & QUERY运算结果为
 *  00000000000000000000000000001011
 *  00000000000000000000000000000001
 * =00000000000000000000000000000001
 * =1
 * 比如 auths & DELETE运算结果为
 *  00000000000000000000000000001011
 *  00000000000000000000000000000100
 * =00000000000000000000000000000000
 * =0
 * 直接使用更加方便,比如判断是否有删除和更新权限
 * if (auths & UPDATE && auths & DELETE)) {
 *  ...
 * }
 */
```

### 是否不包含某个标志
```js
// before
const containFlag = (auths, [...flags]) => 
  flags.every(flag => auths.includes(flag))

//after
const containFlag = (auths, [...flags]) =>
  flags.every(flag => !(auths & flag))

```

### 判断是否只有某个标志
这个跟平时一样，只要使用全等操作符就可以了
```js
// before
const equalFlag = (auths, flag) =>
  flags.length === 1 && flags[0] === flag

//after
// 判断是否只有某个标志直接使用全等即可
const equalFlag = (auths, flag) => auths === flag
/* 直接使用更方便
 * if (auths === UPDATE) {
 *  ...
 * }
 */
 
```

### 添加标志
其实添加标志与初始化一样,只需要使用 `按位或(|)`直接联合即可,而且不需要判断当前是否有,因为加入有的话使用`按位或(|)`会保持跟之前一致
```js
// before
const addFlag = (auths, [...flags]) => {
  flags.forEach(flag => {
    if (!containFlag(flag)) {
      auths.push(flag)
    }
  })
}

// after
const addFlag = (auths, [...flags]) => {
  flags.forEach(flag => {
    auths |= flag
  })
}
/**
 * 比如 auths | DELETE运算结果为
 *  00000000000000000000000000001011
 *  00000000000000000000000000000100
 * =00000000000000000000000000001111
 * 直接使用更加方便,要添加权限,z
 * auths = auths | DELETE | QUERY
 */

```

### 删除标志
删除标志本质上是要将要删除标志中1的位数在变成0,这有些麻烦,因为无论是`按位或(|)`或者 `按位与(&)` 都不能满足,`按位或(|)`在有这个标志时不变,在不存在这个标志时会添加,`按位与(&)`也不行,在没有这个标志时会全部清除,在有这个标志时会仅剩这个标志.这时候我们就要引入上文说的`按位非 (~)`运算符了,我们可以先将要删除的标志取`按位非`,这时候除了表示标志的位数为0其他都为1,这时候我们`按位与(&)`联合这个处理后的数字,就能得到我们想要的效果了

```js
// before
const removeFlag = (auths, [...flags]) => {
  flags.forEach(flag => {
    const index = auths.indexOf(flag)
    if (index > -1) {
      flags.splice(index, 1)
    }
  })
}
// after
const removeFlag = (auths, [...flags]) => {
  flags.forEach(flag => {
    auths &= ~flag
  })
}

/**
 * 比如 auths &= ~DELETE运算结果为
 *  UPDATE            00000000000000000000000000000010
 *  ~UPDATE           11111111111111111111111111111101
 *  auths             00000000000000000000000000001011
 *  auths &= ~UPDATE  00000000000000000000000000001001
 * 直接使用更加方便,要删除的权限,
 * auths & ~DELETE
 */

```

## 优缺点
**优点**:相对于数组来说使用位运算符的速度要快得多,特别是状态比较多,或者使用比较频繁的情况下,而且对于熟悉位运算符的人来说,更加直观.<br>
**缺点**:正如优点所对应的一样,对于不熟悉位运算符的开发同学,这一定是魔鬼写法,非常不友好.而且`左移(>>)`运算符最多只支持32位左移,比如`numToBinaryString(1 << 30)`结果就到达 `1000000000000000000000000000000`了,所以这种管理标志方法最多只能支持31中标志,不过已经足够了,因为大部分应用是不超过31种标志的.