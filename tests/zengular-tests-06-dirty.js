describe('the tests of the step 6 of the workshop', function() {

  var scope, listenerCalls;

  beforeEach(function() {
    listenerCalls = 0;
    scope = new Scope();
  });

  it('should not watch a deep change if not watched by value', function() {

    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      listenerCalls++;
    });

    scope.$apply(function() {
      scope.value = ['first value'];
    });

    scope.$apply(function() {
      scope.value.push('second value');
    });

    expect(listenerCalls).toBe(1);

  });

  it('should watch a deep change if watched by value', function() {

    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      listenerCalls++;
    }, true);

    scope.$apply(function() {
      scope.value = ['first value'];
    });

    scope.$apply(function() {
      scope.value.push('second value');
    });

    expect(listenerCalls).toBe(2);

  });

});
