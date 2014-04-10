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
