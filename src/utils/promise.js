
/* 
1、 promise
  1、三种状态、一旦成为fulfilled或rejected。状态不可修改
  2、接受一个回调函数handler，handler接受两个函数，resolve、reject。执行该函数，如果报错，调用reject
2、then
  1、then可以多次被调用
  2、then接受两个参数 onFulFill、onRejected
  3、then返回一个新的promise2。promise2的状态与onFulFill、onRejected有关
    1、onFulFill、onRejected 返回的是正常值，则promise2 resolve 该值
    2、onFulFill、onRejected 返回的是promise3，则promise2 的状态与promise3相同
    3、onFulFill、onRejected 执行中报错promise2 执行reject

*/


class Promise {
  constructor(handler) {
    this.onFulfillcbs = []
    this.onrejectedcbs = []
    this.data = ""
    this.status = 'pending'

    const resolve = val => {
      const run = () => {
        // 不能放run的外面，2.1 状态不可修改，如果放到外面，setTimeout 是宏任务，同时执行resolve，reject，status 都没有改变，所以里面的内容都会执行
        if (this.status !== 'pending') return
        this.data = val
        this.status = 'fulfilled'
        this.onFulfillcbs.forEach(cb => cb(val))
      }
      setTimeout(run, 0)
    }

    const reject = err => {
      const run = () => {
        if (this.status !== 'pending') return
        this.data = err
        this.status = 'rejected'
        this.onrejectedcbs.forEach(cb => cb(err))
      }
      setTimeout(run, 0)
    }

    try {
      handler(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      let { status, data } = this
      const pending = 'pending'
      const fulfilled = 'fulfilled'
      const rejected = 'rejected'
      const _resolve = (val) => {
        const run = () => {
          try {
            if (typeof onFulfilled === 'function') {
              let x = onFulfilled(val)
              resolvePromise(promise2, x, resolve, reject)
            } else {
              resolve(onFulfilled)
            }
  
          } catch (err) {
            reject(err)
          }
        }
        // 2.2.4
        run()
        // setTimeout(run, 0)
      }

      const _reject = (val) => {
        const run = () => {
          try {
            let res = onRejected(val)
            resolvePromise(res)
          } catch (err) {
            reject(err)
          }
        }
        run()
        setTimeout(run, 0)
      }
      switch (status) {
        case pending:
          this.onFulfillcbs.push(_resolve)
          this.onrejectedcbs.push(_reject)
          break
        case fulfilled:
          _resolve(data)
          break
        case rejected:
          _reject(data)
          break
      }
    })

    return promise2
  }

  resolve(val){
    return new Promise(resolve => {
      resolve(val)
    })
  }
}


// 我感觉resolvePromise 不可能会被调用多次。但是规范里面要求不能被调用多次
function resolvePromise(promise, x, resolve, reject){
  if (x === promise) {
    reject(new Error("不能返回promise本身"))
  } else if (x instanceof Object || typeof x === 'function') {
    let then = x.then
    if(typeof then === 'function'){
      then.call(x, y => {
        resolvePromise(promise, y, resolve, reject)
      }, r=> {
        reject(r)
      })
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}


//  配合使用 promises-aplus-tests 测试
Promise.deferred = Promise.defer = function() {
  var dfd = {}
  dfd.promise = new Promise(function(resolve, reject) {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise;




