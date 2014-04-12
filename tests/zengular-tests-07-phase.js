describe('the tests of the step 7 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

  });

  it('sould add a function $$beginPhase and another $$clearPhase in the Scope', function() {

    expect(_.isFunction(scope.$$beginPhase)).toBe(true);

    expect(_.isFunction(scope.$$clearPhase)).toBe(true);

  });

  it('should prevent to launch a digest while one is already going (maxed at 25)', function() {

    listenerFn = function () {
      if(listenerFn.calls.count() >= 25) {
        throw 'listener calls to many times (' + listenerCalls + ')';
      }
      scope.$digest();
    };

    spyOn(window, 'listenerFn').and.callThrough();

    scope.$watch(function (scope) {
      return scope.value;
    }, listenerFn);

    try {
      scope.$apply(function() {
        scope.value = 'first value';
      });
    } catch (error) {}

    expect(listenerFn.calls.count()).not.toBe(25);

  });

  it('should clear phase to be able to use $watch multiple times', function() {

    listenerFn = function () {};

    spyOn(window, 'listenerFn');

    scope.$watch(function (scope) {
      return scope.value;
    }, listenerFn);

    scope.$apply(function() {
      scope.value = 'first value';
    });

    scope.$apply(function() {
      scope.value = 'second value';
    });

    expect(listenerFn.calls.count()).toBe(2);

  });

  it('should clear phase to be able to use $watch multiple times even in case off digest loop failed', function() {

    firstListenerFn = function() {
      scope.secondValue += '2';
    }

    secondListenerFn = function() {
      scope.value += '1';
      if(secondListenerFn.calls.count >= 25) {
        throw 'listener calls to many times (' + secondListenerCalls + ')';
      }
    }

    spyOn(window, 'secondListenerFn').and.callThrough();

    scope.$watch(function(scope) {
      return scope.value;
    }, firstListenerFn);

    scope.$watch(function(scope) {
      return scope.secondValue;
    }, secondListenerFn);

    try {
      scope.$apply(function() {
        scope.value = 'first value';
      });
    } catch (error) {}

    //Previous test verifying that the digest loop has not failed
    expect(secondListenerFn.calls.count()).not.toBe(25);

    var callsAfterLoop = secondListenerFn.calls.count();

    try {
      scope.$apply(function() {
        scope.value = 'second value';
      });
    } catch (error) {}

    //New test verifying that after a digest loop failed, the digest can restart
    expect(secondListenerFn.calls.count()).not.toBe(callsAfterLoop);

  });

});
