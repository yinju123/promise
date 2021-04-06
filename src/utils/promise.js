// const Promise = require("./promise2")

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
        this.data = val
        this.status = resolved
        this.onFulfilledCbs.forEach(cb => cb(val))
      }
      setTimeout(run, 0)
    }

    const _reject = err => {
      const run = () => {
        if (this.status !== pending) return
        this.data = err
        this.status = rejected
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
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        let { status, data } = this
        typeof onFulfilled !== 'function' && (onFulfilled = val => { resolve(val) })
        typeof onRejected !== 'function' && (onRejected = err => { throw err })
        const onFulfilledCb = val => {
          try {
            let x = onFulfilled(val)
            resolvePromise(promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }

        const onRjectedCb = val => {
          try {
            let x = onRejected(val)
            resolvePromise(promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }

        switch (status) {
          case pending:
            this.onFulfilledCbs.push(onFulfilledCb)
            this.onRejectedCbs.push(onRjectedCb)
            break
          case resolved:
            onFulfilledCb(data)
            break
          case rejected:
            onRjectedCb(data)
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
    reject(new TypeError('不能返回promise本身'))
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
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise


