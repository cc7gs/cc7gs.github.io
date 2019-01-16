---
title: js面试题(第一篇
date: 2019-01-16 22:25:00
tags: js
category: 面试题汇总
---
# 实现call、apply及bind函数

对于call,apply的理解:

1、call 方法第一个参数是要绑定给this的值，后面传入的是一个参数列表。当第一个参数为null、undefined的时候，默认指向window。

2、apply接受两个参数，第一个参数是要绑定给this的值，第二个参数是一个参数数组。当第一个参数为null、undefined的时候，默认指向window。

3、bind 第一个参数是this的指向，从第二个参数开始是接收的参数列表。区别在于bind方法返回值是函数以及bind接收的参数列表的使用。

4、bind返回对应函数, 便于稍后调用； apply, call则是立即调用。

## call方法的实现:
```javascript
/**
 * 实现思路:
 *  1. 当不传入第一个参数时,则默认上下文环境为window
 *  2. 改变this 指向,让新的对象可以执行该函数，并能接受参数
 * 
 */
Function.prototype.myCall=function(context){
    //如果调用者不是函数则抛出异常
    if(typeof this!=='function'){
        throw new TypeError('Error');
    }
    //如果context,没有传，或者传入undefined null 则this 执行 window
    context=context || window;
    context.fn=this;
    const args=[...arguments].slice(1);
    const result=context.fn(...args);
    delete context.fn;
    return result;
}
```

## apply方法的实现

```javascript
/**
 * apply实现思路与call相同,只是参数处理方式不同 
 */
Function.prototype.myApply=function(context){
    if(typeof this !=='function'){
        throw new TypeError('Error');
    }
    context=context||window;
    context.fn=this;
    let result=null;
    //如果传入参数则出入
    if(arguments[1]){
        result=context.fn(...arguments[1]);
    }else{
        result=context.fn();
    }
    //释放内存空间
    delete context.fn;
    return result;
}
```

## bind方法的实现

```javascript
/**
 * apply实现思路与call相同,只是参数处理方式不同 
 */
Function.prototype.myApply=function(context){
    if(typeof this !=='function'){
        throw new TypeError('Error');
    }
    context=context||window;
    context.fn=this;
    let result=null;
    //如果传入参数则出入
    if(arguments[1]){
        result=context.fn(...arguments[1]);
    }else{
        result=context.fn();
    }
    //释放内存空间
    delete context.fn;
    return result;
}
```

# 解释 0.1+0.2!=0.3
JS浮点数计算精度问题是因为某些小数没法用二进制精确表示出来。JS使用的是IEEE 754双精度浮点规则。

```javascript
/**
* 因为 0.1 和0.2 在表示小数时是无限循的
* IEEE 754双精度版本(64)位就将超出部分进行裁剪
* 所以就会出现下面的情况
*/
//true
0.100000000000000002===0.1
// true
0.200000000000000002 === 0.2 
 
 
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true
```
修正方案：

- 使用特殊的进制数据类型，如前文提到的bignumber（对精度要求很高，可借助这些相关的类库）
- 通过toFixed来进行修正后再转回数字(parseFloat)

# ew的原理是什么? 通过字面量和new创建对象的区别?

1. 创建一个空对象，作为将要返回的对象实例
2. 将这个空对象的原型，指向构造函数的prototype属性
3. 绑定函数内部的this
4. 开始执行构造函数

```javascript
function create(){
    //设置一个空对象
    let obj={};
    //取出构造函数
    var Cons=[].shift.call(arguments);
    //让空对象继承构造函数的prototype
    obj.__proto__=Cons.prototype;
    //执行构造函数
    let result=Cons.apply(obj,arguments);
        //确保返回的是一个对象
    return result instanceof Object?result:obj;
}
 
//测试如下:
create(Person,'cc');
 
function Person(name){
    this.name=name;
    console.log(name);
}
```
差点忘了他们的区别:**通过字面量创建对象，不需要通过作用域链一层层找到Object.**

# instanceof的原理及实现

```javscript
/**
 *用来判断 用来判断 left对象是不是right对象的实例 
 */
function _instanceof(left,right){
    let prototype=right.prototype;
    left=left.__proto__;
    while(true){
        if(left===null || left===undefined){
            return false;
        }
        if(prototype===left){
            return true;
        }else{
            left=left.__proto__;
        }
    }
}
```
**继承原来图:**
![继承图](https://user-gold-cdn.xitu.io/2018/5/28/163a55d5d35b866d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

该图应该注意以下几点:
   1. 一切函数都是由 Function函数所创造
   2. 一切函数的原型都指向Object, Object原型的原型指向 null
==instanceof 操作符用来比较两个操作数的构造函数。只有在比较自定义的对象时才有意义==

# Promise的特征是什么? Promise构造函数执行和then函数执行的区别?

**Promise特征**: 
- 链式调用
- 状态不可逆

Promise通过链式调用的方式解决回调嵌套问题，使我们代码更容易理解和维护；Promise 有三种状态 pending,resolved,rejected 这个承诺状态一旦从等待状态变成了其它状态就不能更改状态

==Promise构造函数内的代码会立即==
```javascript
console.log('外层执行环境');
 
let p=new Promise((resolve,reject)=>{
    console.log('promise 执行');
    resolve('1');
    console.log('resolve 后面的语句');
});
p.then(resolveA)
.then((res)=>console.log(res));
 
function resolveA (value){
    return value+'   success';
}
 
/**
*
* 外层执行环境
* promise 执行
* resolve 后面的语句
* 1   success
*/

```
# 实现一个简单的Promise

```javascript
const PENDING='pending';
const RESOLVED='resolved';
const REJECTED='rejected';
function MyPromise(fn){
    //绑定this 让 下面函数中回调不丢失 
    const that=this;
    that.state=PENDING;
    that.value=null;
    that.resolvedCallBacks=[];
    that.rejectedCallBacks=[];
    function resolve(value){
        if(that.state===PENDING){
            that.state=RESOLVED;
            that.value=value;
            //执行 then中的方法
            that.resolvedCallBacks.map(call=>call(that.value))
        }
    }
    function reject(value){
        if(that.state===PENDING){
            that.state=REJECTED;
            that.value=value;
            that.rejectedCallBacks.map(call=>call(that.value))
        }
    }
    //执行promise 中的函数
    try {
        console.log('new Promise');        
        fn(resolve,reject);
    } catch (error) {
        reject(error);
    }
}
MyPromise.prototype.then=function(onFulfilled,onRejected){
    console.log('执行 then方法');
    const that=this;
    onFulfilled=typeof onFulfilled==='function'?onFulfilled:f=>f;
    onRejected=typeof onRejected==='function'?onRejected:error=>{throw error}
    if(that.state===PENDING){
        console.log('将 then中方法放到 数组中');
        that.resolvedCallBacks.push(onFulfilled);
        that.rejectedCallBacks.push(onRejected);
    }
   
    //将then中的方法放到数组中
    if(that.state===RESOLVED){
        onFulfilled(that.value);
    }
    if(that.state===REJECTED){
        onRejected(that.value);
    }
}
 
/**
 * 测试如下:
 */
 
console.log('外层执行环境');
let p=new MyPromise((resolve,reject)=>{
    console.log('promise 回调函数执行');
    setTimeout(()=>{resolve('1')},0);
    console.log('resolve 后面的语句');
});
p.then((res)=>{console.log(res+' success')});
 
 
//测试结果
/**
外层执行环境
new Promise
promise 回调函数执行
resolve 后面的语句
执行 then方法
将 then中方法放到 数组中
1 success
*/

```

# async及await的特点，await原理是什么?

~~对于async的理解可以先参考博客面试题专栏中的异步入门之async~~

**async函数是Generator函数的语法糖,在函数内部使用 await来表示异步。**

- async 函数返回一个Promise对象
- async 函数返回的Promise对象，必须等到内部所以 await命令Promise对象执行完,才会发生状态改变
- async函数中若await 改变了状态，则后面的await都不会被执行


```javascript
/**
 * async 函数返回一个Promise对象
 * 函数内部 return 返回的值，会成为then方法回调的参数
 * 函数内部异常，会被 catch方法接收到。
 */
async function test(){
    return '1';
 }
async function test1(){
    throw new Error('error');
}
 
test()
.then(v=>console.log(v))
.catch(e=>console.log(e));
 
test1()
.then(v=>console.log(v))
.catch(e=>console.log(e));

```

```javascript
/**
 * 
 * 当 await 返回的是Promise对象时，
 * 只有等到所有 await中 promise执行完后，才执行then回调 
 */
const delay=t=>new Promise(resolve=>setTimeout(resolve,t));
async function f(){
    await delay(1000);
    await delay(2000);
    return 'done';
}
f().then(v=>console.log(v)); //3s 后执行打印
console.log('我先被执行');

```

```javascript
/**
 * 当 await后跟的是有状态的Promise时,
 * 此时之后所有的await都不会被执行 
 */
let a;
async function func() {
    await Promise.reject('error');
    a = await 1;
}
 
func()
    .then(v => console.log(v, '-----------', a))
    .catch(e => console.log(e));
//输出 error，而 then方法不会被执行

```
##  async 对异常错误的处理

```javascript
/**
 * 通过 try-catch 对异常捕获
 * 使得后面的 await被执行
 */
async function funcTryCatch() {
    try {
        await Promise.reject('error');
        
    } catch (error) {
        console.log('error,from try-cath')        
    }
    a = await 1;
    return a;
}
 
funcTryCatch()
    .then(v => console.log(v, '-----------', a))
    .catch(e => console.log(e));

```

# 垃圾回收机制是怎样的?

V8实现了准确式GC,GC算法采用分代式垃圾回收机制。因此V8内存堆分为新生dui代和老生代两部分。

**新生代算法**

新生代中的对象一般存活时间较短，使用 Scavenge GC 算法。

在新生代空间中，内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。

**老生代算法**

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是标记清除算法和标记压缩算法。

 
该文内容，会不断添加... 

参考原文：https://juejin.im/post/596e142d5188254b532ce2da