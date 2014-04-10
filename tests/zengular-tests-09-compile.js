describe('the tests of the step 9 of the workshop', function() {

  var scope;

  beforeEach(function() {
    scope = new Scope();
  });

  it('sould add a function $compile', function() {

    expect(_.isFunction($compile)).toBe(true);

  });

  it('sould $compile recurse on all nodes', function() {

    spyOn(window, '$compile').and.callThrough();

    var element = document.getElementById('domTestSection');

    $compile(element);

    expect($compile.calls.count()).toBe(3);

  });

  it('sould $compile recurse on all nodes and launch directives function with the good parameters', function() {

    var elementRoot = document.getElementById('domTestSection');
    var elementDirective = document.getElementById('elementWithDirective');
    var scope = {};

    window.myDirectiveTest = function() {};

    spyOn(window, 'myDirectiveTest');

    $directive('my-directive-test', window.myDirectiveTest);

    $compile(elementRoot, scope);

    expect(window.myDirectiveTest).toHaveBeenCalledWith(scope, elementDirective, elementDirective.attributes);

  });

});
