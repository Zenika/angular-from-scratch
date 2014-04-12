describe('the tests of the step 3 of the workshop', function() {

  beforeEach(function() {

    firstValue = 'first value';

    scope = new Scope();
    scope.value = firstValue;

    watcherFn = function (scope) {
      return scope.value;
    }

    listenerFn = function () {};

    spyOn(window, 'watcherFn').and.callThrough();
    spyOn(window, 'listenerFn');

    scope.$watch(watcherFn, listenerFn);

  });

  it('sould add a function $digest in the Scope', function() {

    expect(_.isFunction(scope.$digest)).toBe(true);

  });

  it('should launch the listener when calling $digest', function() {

    scope.$digest();

    expect(listenerFn.calls.count()).toBe(1);

  });

  it('should launch the watcher and the listener with the right arguments', function() {

    scope.$digest();

    expect(watcherFn).toHaveBeenCalledWith(scope);

    expect(listenerFn).toHaveBeenCalledWith(firstValue, undefined, scope);

  });

  it('should launch the listener only once by changes when calling $digest', function() {

    scope.$digest();

    expect(listenerFn.calls.count()).toBe(1);

    scope.value = "second value";

    scope.$digest();
    scope.$digest();
    scope.$digest();

    expect(listenerFn.calls.count()).toBe(2);

  });

});
