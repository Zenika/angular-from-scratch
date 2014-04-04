describe('the test suite of Angular From Scratch', function() {

  describe('the tests of the step 1 of the workshop', function() {

    it('sould be a scope defined', function() {

      expect(_.isFunction(Scope)).toBe(true);

    });

  });

  describe('the tests of the step 2 of the workshop', function() {

    var scope;

    beforeEach(function() {
      scope = new Scope();
    });

    it('sould add a function $watch in the Scope', function() {

      expect(_.isFunction(scope.$watch)).toBe(true);

    });

    it('sould add a watcher object in $$watchers when using $watch', function() {

      var myWatcher = function() {}, myListener = function() {};

      scope.$watch(myWatcher, myListener);

      expect(_.isArray(scope.$$watchers)).toBe(true);
      expect(scope.$$watchers.length).toBe(1);
      expect(scope.$$watchers[0].watcherFn).toBe(myWatcher);
      expect(scope.$$watchers[0].listenerFn).toBe(myListener);

    });

  });

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

  });

});
