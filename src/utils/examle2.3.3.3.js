
import Promise from './promise'
var other = { other: "other" };
let yf1 = function (value) {
  return {
    then: function (onFulfilled) {
      onFulfilled(value);
      onFulfilled(other);
    },
  };
};

let yf2 = function (value) {
  return {
    then: function (onFulfilled) {
      setTimeout(function () {
        onFulfilled(value);
      }, 0);
    },
  };
};

let p = new Promise((resolve, reject) => {
  resolve(1);
});

p.then((res) => {
  let obj = {
    then: (onFulfilled) => {
      onFulfilled(yf1(yf2({ a: 4 })));
    },
  };
  return obj;
}).then((res) => {
  console.log("res2", res);
});