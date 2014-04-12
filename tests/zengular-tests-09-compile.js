describe('the tests of the step 9 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

  });

  it('sould add a function $compile', function() {

    expect(_.isFunction($compile)).toBe(true);

  });

  it('sould $compile recurse on all nodes', function() {

    spyOn(window, '$compile').and.callThrough();

    var element = document.getElementById('domStep09');

    $compile(element, scope);

    expect($compile.calls.count()).toBe(2);

  });

  it('sould $compile recurse on all nodes and launch directives function with the good parameters', function() {

    var elementRoot = document.getElementById('domStep09');
    var elementDirective = document.getElementById('elementWithDirective');

    myDirectiveTest = function() {};

    spyOn(window, 'myDirectiveTest');

    $directive('my-directive-test', myDirectiveTest);

    $compile(elementRoot, scope);

    expect(window.myDirectiveTest).toHaveBeenCalledWith(scope, elementDirective, elementDirective.attributes);

  });

});
