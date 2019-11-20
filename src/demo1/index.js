// 前置知识理解 箭头函数
// 箭头函数在自己的作用域内没有自己的 this，如果要使用 this ，就会指向定义时所在的作用域的 this 值。（终于理解了）
// 经典案例
function User() {
  this.name = 'John';
  setTimeout(function greet() {
    console.log(`Hello, my name is ${this.name}`); // Hello, my name is
    console.log(this); // window
  }, 1000);
}
function User() {
  this.name = 'John';
  setTimeout(() => {
    'use strict'
    console.log(`Hello, my name is ${this.name}`); // Hello, my name is John
    console.log(this); // User {name: "John"}
  }, 1000);
}
// 1
var x = 11;
var obb = {
  x: 222,
  y: {
    x: 333,
    obc: function f() {
      console.log(this)
      var x = 111;
      var obj = {
        x: 22,
        say: () => {
          console.log(this.x);
        }
      }
      obj.say()
    }
  }
}
// obb.y.obc()
// 2
var x = 11;
var obb = {
  x: 222,
  y: {
    x: 333,
    obc: f = () => {
      console.log(this)
      var x = 111;
      var obj = {
        x: 22,
        say: () => {
          console.log(this.x);
        }
      }
      obj.say();
    }
  }
}
// obb.y.obc()



// call、aplly、bind 实现
// call、aplly、bind 本质都是改变 this 的指向，不同点 call、aplly 是直接调用函数，bind 是返回一个新的函数。call 跟 aplly 就只有参数上不同。

// 一、call实现
// 那么 call 是如何做到改变 this 的指向呢？原理很简单，在方法调用模式下，this 总是指向调用它所在方法的对象，this 的指向与所在方法的调用位置有关，而与方法的声明位置无关（箭头函数特殊）。先写一个小 demo 来理解一下下。

const foo = { name: 'foo' }
foo.fn = function () {
  // 这里的this指向foo, 因为foo调用了fn, 因此fn的this就指向了调用他所在的方法的对象foo上
  console.log(this)
}
foo.fn1 = () => {
  console.log(this) // this => window
}
// foo.fn()
// foo.fn1()

// 利用this机制实现call
Function.prototype.mycall = function (thisArg) {
  // 这里的thisArg就是调用this
  // this指向调用call的对象
  if (typeof this !== 'function') {
    // 调用call的若不是函数则报错
    throw new TypeError(this + 'is not a function')
  }
  const args = [...arguments].slice(1)
  thisArg = thisArg || window // 如果没有被传调用对象，则指向window对象
  thisArg.fn = this
  // 执行该属性
  const result = thisArg.fn(...args)
  // 删除该属性
  delete thisArg.fn
  return result
}
// 利用this机制实现aplly
Function.prototype.myaplly = function (thisArg) {
  // 这里的thisArg就是调用this
  // this指向调用aplly的对象
  if (typeof this !== 'function') {
    // 调用aplly的若不是函数则报错
    throw new TypeError(this + 'is not a function')
  }
  const args = arguments[1]
  thisArg = thisArg || window // 如果没有被传调用对象，则指向window对象
  thisArg.fn = this
  // 执行该属性
  const result = thisArg.fn(...args)
  // 删除该属性
  delete thisArg.fn
  return result
}
// 测试mycall
// function bar() {
//   console.log('1', this, arguments);
// };
const bar = function () {
  console.log('1', this, arguments);
};
let name = 'hahah'
bar.prototype.name = 'bar';
const aoo = {
  name: 'aoo'
};

// bar.mycall(aoo, 1, 2, 3); // aoo [1, 2, 3]
// bar.myaplly(aoo, [1, 2, 3]); // aoo [1, 2, 3]
// bar(1,2,3)


// 实现bind
Function.prototype.mybind = function (thisArg) {
  if (typeof this !== 'function') {
    throw new TypeError(this + 'is not a function')
  }
  // 拿到参数，传递给调用者
  const args = Array.prototype.slice.call(arguments, 1),
    // 保存this
    self = this,
    // 构造一个干净的函数，用于保存原函数的原型
    nop = function () {},
    // 绑定的函数
    bound = function () {
      // this instanceof nop, 判断是否使用 new 来调用 bound
      // 如果是 new 来调用的话，this的指向就是其实例，
      // 如果不是 new 调用的话，就改变 this 指向到指定的对象 o
      return self.apply(
        this instanceof nop ? this : thisArg,
        args.concat(Array.prototype.slice(arguments))
      )
    }
  // 箭头函数没有 prototype，箭头函数this永远指向它所在的作用域
  if (this.prototype) {
    nop.prototype = this.prototype
  }
  // 修改绑定函数的原型指向
  bound.prototype = new nop();
  return bound
}

// 测试
const boo = function () {
  console.log(this.name, arguments);
};
boo.prototype.name = 'boo';
const voo = {
  name: 'voo'
};
const bound = boo.mybind(voo, 22, 33, 44);
// new bound(); // boo, [22, 33, 44]
bound(); // voo, [22, 33, 44]