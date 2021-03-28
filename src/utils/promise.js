
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


export class Promise {
  constructor(handler) {

    this.onFulfillcbs = []
    this.onrejectedcbs = []
    this.data = ""
    this.status = 'pending'

    const resolve = val => {
      if (this.status !== 'pending') return
      const run = () => {
        this.data = val
        this.status = 'fulfilled'
        this.onFulfillcbs.forEach(cb => cb(val))
      }
      setTimeout(run, 0)
    }

    const reject = err => {
      if (this.status !== 'pending') return
      const run = () => {
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
        try {
          if (typeof onFulfilled === 'function') {
            let x = onFulfilled(val)
            if (x === p2) {
              reject(new Error("不能返回promise本身"))
            } else if (x instanceof Object || typeof x === 'function') {
              let then = x.then
              then.call(x, resolvePromise, rejectPromise)
            } else {
              resolve(x)
            }
          } else {
            resolve(onFulfilled)
          }

        } catch (err) {
          reject(err)
        }
      }

      const _reject = (val) => {
        try {
          let res = onRejected(val)
          if (res instanceof Promise) {
            res.then(resolve)
          } else {
            resolve(res)
          }
        } catch (err) {
          reject(err)
        }
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
}

