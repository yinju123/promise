const pending = 'pending'
const resolved = 'resolved'
const rejected = 'rejected'


class Promise {
  constructor(fn) {
    this.data = ''
    this.status = pending
    this.onFulfilledCbs = []
    this.onRejectedCbs = []

    const _resolve = val => {
      const run = () => {
        if (this.status !== pending) return
        this.status = resolved
        this.data = val
        this.onFulfilledCbs.forEach(cb => cb(val))
      }
      setTimeout(run, 0)
    }

    const _reject = err => {
      const run = () => {
        if (this.status !== pending) return
        this.status = rejected
        this.data = err
        this.onRejectedCbs.forEach(cb => cb(err))
      }
      setTimeout(run, 0)
    }

    try {
      fn(_resolve, _reject)
    } catch (err) {
      _reject(err)
    }

  }

  then(onFulfilled, onRejected) {
    const promise = new Promise((resolve, reject) => {
      // 如果不是异步执行resolvePromise(promise, x, resolve, reject)中的promise可能获取不到
      setTimeout(() => {
        let { data, status } = this
        typeof onFulfilled !== 'function' && (onFulfilled = val => resolve(val))
        typeof onRejected !== 'function' && (onRejected = err => { throw err })
        const onFulfilledCb = val => {
          try {
            let x = onFulfilled(val)
            resolvePromise(promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }

        const onRejectedCb = err => {
          try {
            let x = onRejected(err)
            resolvePromise(promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }
        switch (status) {
          case pending:
            this.onFulfilledCbs.push(onFulfilledCb)
            this.onRejectedCbs.push(onRejectedCb)
            break
          case resolved:
            onFulfilledCb(data)
            break
          case rejected:
            onRejectedCb(data)
            break
        }
      }, 0)
    })
    return promise
  }
}

function isObject(target) {
  return Object.prototype.toString.call(target).slice(-7, -1) === 'Object';
}


function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError('返回值不能是promise本身'))
  } else if (typeof x === 'function' || isObject(x)) {
    let called = false
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

Promise.deferred = Promise.defer = function () {
  var dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise

/*
  1 _resove和_reject是异步执行的，如果把异步放到try-catch会怎样,
  解：因为new Promise 是同步的，所以不能在try-catch加setTimeout
  2 _resove和_reject为什么是异步的，这样做的意义是什么。这对应2.2.2和2.2.3。其实不是异步也可以，只要保证onFulfill不在resolved之前调用就可以。不加setTimeout其实也是符合条件的，但是测试用例感觉不大准确。
  先执行 d.resolve => assert.strictEqual(isFulfilled, true);done(); =>isFulfilled = true; 所以assert.strictEqual(isFulfilled, true);中isFulfilled是false但是这个确实是先执行resolve 在执行onFulfilled的

  var d = deferred();
  var isFulfilled = false;
  d.promise.then(function onFulfilled() {
      assert.strictEqual(isFulfilled, true);
      done();
  });

  setTimeout(function () {
      d.resolve(dummy);
      isFulfilled = true;
  }, 50);

*/


/*
  1 return 新的Promise。
  2 onFulfilled, onRejected 都要查看执行的结果，因为关系到下一个then的执行
  3 return 新的Promise 里面是异步执行的，这个涉及到x的验证，但是上一个promise状态的获取，应该在异步里面获取不然，就会发生状态不对的情况
  4 resolvePromise，rejectPromise 可能执行多次，以第一次为准
  5 值的穿透onFulfilled, onRejected 如果不是函数，那么原本的值会传给下一个then准。他人写的then方法可能会调用多次onFulfill、onRejected或者在onFulfill、onRejected后抛出错误


*/

