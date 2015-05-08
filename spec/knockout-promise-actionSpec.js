define(['knockout', 'src/knockout-promise-action', 'promise'], function(ko, PromiseAction, Promise) {

  describe('knockout-promise-action', function() {
    var action;
    var resolve;
    var reject;
    var asyncActionPromise;
    var promiseStub;

    beforeEach(function() {
      asyncActionPromise = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
      });

      promiseStub = sinon.stub().returns(asyncActionPromise);

      action = PromiseAction(promiseStub);
    });

    describe('before called', function() {

      it('state is reflected', function() {
        expect(action.isPending()).to.be(false);
        expect(action.isResolved()).to.be(false);
        expect(action.isRejected()).to.be(false);
      });

      it('has no active promise', function() {
        expect(action.activePromise()).to.be(undefined);
      });

      it('resolvedWith has nothing', function() {
        expect(action.resolvedWith()).to.be(undefined);
      });

      it('rejectedWith has nothing', function() {
        expect(action.rejectedWith()).to.be(undefined);
      });

    });

    describe('when called', function() {
      var returnValue;
      beforeEach(function() {
        returnValue = action();
      });

      it('state is reflected', function() {
        expect(action.isPending()).to.be(true);
        expect(action.activePromise().isPending()).to.be(true);
        expect(action.isResolved()).to.be(false);
        expect(action.activePromise().isFulfilled()).to.be(false);
        expect(action.isRejected()).to.be(false);
        expect(action.activePromise().isRejected()).to.be(false);
      });

      it('exposes the active promise', function() {
        expect(action.activePromise()).to.be(returnValue);
      });

      describe.skip('called again', function() {
        beforeEach(function() {
          resolve({});
          returnValue = action();
          return asyncActionPromise;
        });

        it('resets all values', function() {
          expect(action.resolvedWith()).to.be(undefined);
          expect(action.rejectedWith()).to.be(undefined);
          expect(action.isPending()).to.be(true);
          expect(action.activePromise().isPending()).to.be(true);
          expect(action.isResolved()).to.be(false);
          expect(action.activePromise().isFulfilled()).to.be(false);
          expect(action.isRejected()).to.be(false);
          expect(action.activePromise().isRejected()).to.be(false);
        });


      });

      describe('after resolve', function() {

        describe('regardless of value', function() {

          beforeEach(function() {
            resolve();
            return asyncActionPromise;
          });

          it('state is reflected', function() {
            expect(action.isPending()).to.be(false);
            expect(action.activePromise().isPending()).to.be(false);
            expect(action.isResolved()).to.be(true);
            expect(action.activePromise().isFulfilled()).to.be(true);
            expect(action.isRejected()).to.be(false);
            expect(action.activePromise().isRejected()).to.be(false);
          });
        });

        describe('hasResult', function() {

          var trueValues = [true, 1, [1], 'string', {
            test: 3
          }];

          trueValues.forEach(function(val) {
            it('is true for: ' + JSON.stringify(val), function() {
              promiseStub.reset();
              promiseStub.returns(new Promise(function(resolve) {
                resolve(val);
              }));


              return action().then(function() {
                expect(action.hasResult()).to.be(true);
              });
            });
          });

          var falseValues = [false, '', 0, null, undefined, NaN, [], {}];

          falseValues.forEach(function(val) {
            it('is false for: ' + JSON.stringify(val), function() {
              promiseStub.reset();
              promiseStub.returns(new Promise(function(resolve) {
                resolve(val);
              }));

              return action().then(function() {
                expect(action.hasResult()).to.be(false);
              });
            });
          });
        });
      });

      describe('after reject', function() {
        beforeEach(function() {
          reject();
          return asyncActionPromise.catch(function() {
            //we know it failed, pretend it didn't
          });
        });

        it('state is reflected', function() {
          expect(action.isPending()).to.be(false);
          expect(action.activePromise().isPending()).to.be(false);
          expect(action.isResolved()).to.be(false);
          expect(action.activePromise().isFulfilled()).to.be(false);
          expect(action.isRejected()).to.be(true);
          expect(action.activePromise().isRejected()).to.be(true);
        });
      });

    });

  });
});
