define(['knockout', 'promise'], function(ko, Promise) {
  'use strict';

  function PromiseAction(action) {
    var activePromise = ko.observable();
    var isPending = ko.observable(false);
    var isResolved = ko.observable(false);
    var isRejected = ko.observable(false);
    var resolvedWith = ko.observable();
    var rejectedWith = ko.observable();

    function wrapper() {
      isPending(true);
      isResolved(false);
      isRejected(false);
      resolvedWith(undefined);
      rejectedWith(undefined);

      var promise = new Promise(function(resolve, reject) {

        action.apply(this, arguments).then(function(data) {
          isPending(false);
          isResolved(true);
          resolvedWith(data);
          resolve(data);
        }, function(err) {
          isPending(false);
          isRejected(true);
          rejectedWith(err);
          reject(err);
        });

      });

      activePromise(promise);

      return promise;
    }

    wrapper.activePromise = ko.pureComputed(activePromise);
    wrapper.isPending = ko.pureComputed(isPending);
    wrapper.isResolved = ko.pureComputed(isResolved);
    wrapper.isRejected = ko.pureComputed(isRejected);
    wrapper.resolvedWith = ko.pureComputed(resolvedWith);
    wrapper.rejectedWith = ko.pureComputed(rejectedWith);

    /**
     * Returns true if resolved value is:
     * An array with length > 0
     * An object with own properties
     * All other truthy values, >=1, true, 'any non 0 length string'
     *
     * All other values are false
     */
    wrapper.hasResult = ko.pureComputed(function() {
      var value = resolvedWith();
      var hasSomething = value ? true : false;

      if (Array.isArray(value)) {
        return value.length > 0;
      } else if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
      } else {
        return hasSomething;
      }

    });

    return wrapper;
  }

  return PromiseAction;
});
