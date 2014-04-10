describe('the tests of the step 7 of the workshop', function() {

  var scope, listenerCalls, firstListenerCalls, secondListenerCalls;

  beforeEach(function() {
    listenerCalls = 0, firstListenerCalls = 0, secondListenerCalls = 0;
    scope = new Scope();
  });

  it('sould add a function $$beginPhase and another $$clearPhase in the Scope', function() {

    expect(_.isFunction(scope.$$beginPhase)).toBe(true);

    expect(_.isFunction(scope.$$clearPhase)).toBe(true);

  });

  it('should prevent to launch a digest while one is already going (maxed at 25)', function() {

    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      listenerCalls++;
      if(listenerCalls >= 25) {
        throw 'listener calls to many times (' + listenerCalls + ')';
      }
      scope.$digest();
    });

    try {
      scope.$apply(function() {
        scope.value = 'first value';
      });
    } catch (error) {}

    expect(listenerCalls).not.toBe(25);

  });

  it('should clear phase to be able to use $watch multiple times', function() {

    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      listenerCalls++;
    });

    scope.$apply(function() {
      scope.value = 'first value';
    });

    scope.$apply(function() {
      scope.value = 'second value';
    });

    expect(listenerCalls).toBe(2);

  });

  it('should clear phase to be able to use $watch multiple times even in case off digest loop failed', function() {

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

    //Previous test verifying that the digest loop has not failed
    expect(secondListenerCalls).not.toBe(25);

    var callsAfterLoop = secondListenerCalls;

    try {
      scope.$apply(function() {
        scope.value = 'second value';
      });
    } catch (error) {}

    //New test verifying that after a digest loop failed, the digest can restart
    expect(secondListenerCalls).not.toBe(callsAfterLoop);

  });

});
