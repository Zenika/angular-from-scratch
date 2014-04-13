describe('the tests of the step 12 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

  });

  it('sould add a directive called ng-click', function() {

    var directiveNgClick = $directive('ng-click');

    expect(_.isFunction(directiveNgClick)).toBe(true);

  });

  it('sould execute the contentof ng-click when a click is performed', function() {

    var elementRoot = document.getElementById('domStep12');
    var elementWithNgClick = document.getElementById('elementWithNgClick');

    scope.test = {
      click: function() {
        scope.test.value += '.';
      }
    }

    scope.$apply(function() {
      scope.test.value = 'first value';
    });

    listenerFn = function() {}

    spyOn(scope.test, 'click').and.callThrough();
    spyOn(window, 'listenerFn');

    scope.$watch(function(scope) {
      return scope.test.value;
    }, listenerFn);

    $compile(elementRoot, scope);

    expect(scope.test.click.calls.count()).toBe(0);
    expect(listenerFn.calls.count()).toBe(0);

    var event = new CustomEvent("click");
    elementWithNgClick.dispatchEvent(event);

    expect(scope.test.click.calls.count()).toBe(1);
    expect(listenerFn.calls.count()).toBe(1);

  });

});
