describe('the tests of the step 6 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

  });

  it('should not watch a deep change if not watched by value', function() {

    listenerFn = function () {};

    spyOn(window, 'listenerFn');

    scope.$watch(function (scope) {
      return scope.value;
    }, listenerFn);

    scope.$apply(function() {
      scope.value = ['first value'];
    });

    scope.$apply(function() {
      scope.value.push('second value');
    });

    expect(listenerFn.calls.count()).toBe(1);

  });

  it('should watch a deep change if watched by value', function() {

    listenerFn = function () {};

    spyOn(window, 'listenerFn');

    scope.$watch(function (scope) {
      return scope.value;
    }, listenerFn, true);

    scope.$apply(function() {
      scope.value = ['first value'];
    });

    scope.$apply(function() {
      scope.value.push('second value');
    });

    expect(listenerFn.calls.count()).toBe(2);

  });

});
