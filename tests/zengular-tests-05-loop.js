describe('the tests of the step 5 of the workshop', function() {

  var scope, firstListenerCalls, secondListenerCalls;

  beforeEach(function() {
    firstListenerCalls = 0, secondListenerCalls = 0;
    scope = new Scope();
  });

  it('should launch the loop on digest and detect listener which trigger new changes', function() {

    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      firstListenerCalls++;
      scope.secondValue = 'new value';
    });
    scope.$watch(function(scope) {
      return scope.secondValue;
    }, function() {
      secondListenerCalls++;
    });

    scope.$apply(function() {
      scope.value = 'first value';
    });

    expect(firstListenerCalls).toBe(1);
    expect(secondListenerCalls).toBe(1);

  });

  it('should prevent the digest loop to infinitly loop (maxed at 25)', function() {

    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      firstListenerCalls++;
      scope.secondValue += '2';
    });
    scope.$watch(function(scope) {
      return scope.secondValue;
    }, function() {
      secondListenerCalls++;
      scope.value += '1';
      if(secondListenerCalls >= 25) {
        throw 'listener calls to many times (' + secondListenerCalls + ')';
      }
    });

    try {
      scope.$apply(function() {
        scope.value = 'first value';
      });
    } catch (error) {}

    expect(secondListenerCalls).not.toBe(25);

  });

});
