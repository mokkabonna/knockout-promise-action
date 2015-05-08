'use strict';
var Promise = require('bluebird');
var ko = require('knockout');

function PromiseAction(action) {
  function wrapper() {
    var p = new Promise(function(resolve, reject) {
      wrapper.activePromise(p);
      wrapper.isPending(true);

      var result = action.apply(this, arguments);
      result.then(function(data) {
        console.log('resolving');
        wrapper.isResolved(true);
        wrapper.isPending(false);
        wrapper.resolvedWith(data);

        return data;
      }, function(err) {
        console.log('rejecting');
        wrapper.isRejected(true);
        wrapper.isPending(false);
        wrapper.rejec(err);

        throw err;
      });

      return result;
    });

    return p;
  }

  wrapper.activePromise = ko.observable();
  wrapper.isResolved = ko.observable(false);
  wrapper.isRejected = ko.observable(false);
  wrapper.isPending = ko.observable(false);
  wrapper.rejectedWith = ko.observable();
  wrapper.resolvedWith = ko.observable();

  return wrapper;
}

var res;
var rej;

var action = new PromiseAction(function() {
  return new Promise(function(resolve, reject) {
    console.log('starting promise');
    res = resolve;
    rej = reject;
  });
});

console.log(action.isPending());
console.log(action.isResolved());
console.log(action.isRejected());

action();

console.log(action.isPending());
console.log(action.isResolved());
console.log(action.isRejected());

res(1);

console.log(action.isPending());
console.log(action.isResolved());
console.log(action.isRejected());





// var p = new Promise(function(resolve, reject) {
//   resolve(2);
//   reject(4);
// });

// p.then(function(result) {
//   console.log(result);
// }).catch(ReferenceError, function(err) {
//   console.log(err);
// }).catch(function(err) {
//   console.log('normal err',err);
// }).finally(function() {
//   console.log(arguments);
// });

// console.log('after');
