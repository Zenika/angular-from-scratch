describe('the tests of the step 4 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

    listenerFn = function () {};

    spyOn(window, 'listenerFn');

    scope.$watch(function (scope) {
      return scope.value;
    }, listenerFn);

  });

  it('sould add a function $apply in the Scope', function() {

    expect(_.isFunction(scope.$apply)).toBe(true);

  });

  it('should launch the listener when calling $apply and changing something', function() {

    scope.$apply(function() {
      scope.value = 'first value';
    });

    expect(listenerFn.calls.count()).toBe(1);

  });

  it('should launch the listener when calling $apply even with an exception', function() {

    try {
      scope.$apply(function() {
        scope.value = 'second value';
        throw 'test error';
      });
    } catch (error) {
      //nothing
    }

    expect(listenerFn.calls.count()).toBe(1);

  });

});
