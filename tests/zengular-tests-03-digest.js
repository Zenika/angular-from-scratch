describe('the tests of the step 3 of the workshop', function() {

  var listenerCalls;

  beforeEach(function() {
    listenerCalls = 0;

    scope = new Scope();
    scope.value = 'first value';
    scope.$watch(function(scope) {
      return scope.value;
    }, function() {
      listenerCalls++;
    });
  });

  it('sould add a function $digest in the Scope', function() {

    expect(_.isFunction(scope.$digest)).toBe(true);

  });

  it('should launch the listener when calling $digest', function() {

    scope.$digest();

    expect(listenerCalls).toBe(1);

  });

  it('should launch the listener only once by changes when calling $digest', function() {

    scope.$digest();

    expect(listenerCalls).toBe(1);

    scope.value = "second value";

    scope.$digest();
    scope.$digest();
    scope.$digest();

    expect(listenerCalls).toBe(2);

  });

  //TODO test for arguments passed to listener

});
