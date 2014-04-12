describe('the tests of the step 5 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

  });

  it('should launch the loop on digest and detect listener which trigger new changes', function() {

    firstListenerFn = function() {
      scope.secondValue = 'new value';
    }

    secondListenerFn = function() {}

    spyOn(window, 'firstListenerFn').and.callThrough();
    spyOn(window, 'secondListenerFn');

    scope.$watch(function(scope) {
      return scope.value;
    }, firstListenerFn);

    scope.$watch(function(scope) {
      return scope.secondValue;
    }, secondListenerFn);

    scope.$apply(function() {
      scope.value = 'first value';
    });

    expect(firstListenerFn.calls.count()).toBe(1);
    expect(secondListenerFn.calls.count()).toBe(1);

  });

  it('should prevent the digest loop to infinitly loop (maxed at 25)', function() {

    firstListenerFn = function() {
      scope.secondValue += '2';
    }

    secondListenerFn = function() {
      scope.value += '1';
      if(secondListenerFn.calls.count() >= 25) {
        throw 'listener calls to many times (' + secondListenerFn.calls.count() + ')';
      }
    }

    spyOn(window, 'firstListenerFn').and.callThrough();
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

    expect(secondListenerFn.calls.count()).not.toBe(25);

  });

});
