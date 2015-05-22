define(['../src/knockout-promise-action', 'knockout', 'promise'], function(promiseAction, ko, Promise) {
  'use strict';


  function fakeAjaxCall() {
    return new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
  }

  var resolve;
  var reject;

  var vm = {
    initiated: true,
    reject: function() {
      reject(new Error('Server timed out'));
    },
    resolveWithEmptyList: function() {
      resolve([]);
    },
    toggleViewErrorHandling: function() {
      vm.loadToDoList.handleErrorInView(!vm.loadToDoList.handleErrorInView());
    },
    resolveWithList: function() {
      resolve(['Wash car', 'Work out', 'Make app']);
    },
    loadToDoList: promiseAction(function() {
      return fakeAjaxCall();
    })
  };

  vm.dump = ko.pureComputed(function() {
    var obj = Object.keys(vm.loadToDoList).reduce(function(all, key) {

      all[key] = vm.loadToDoList[key];

      return all;
    }, {});

    return JSON.stringify(ko.toJS(obj), function(k, v) {
      if (v === undefined) {
        return v + '';
      }
      return v;
    }, 2);
  });


  ko.applyBindings(vm);

});
