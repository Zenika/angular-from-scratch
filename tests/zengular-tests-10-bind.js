describe('the tests of the step 10 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

    var elementWithNgBind = document.getElementById('elementWithNgBind');

    elementWithNgBind.innerHTML = 'Test p block';

  });

  it('sould add a directive called ng-bind', function() {

    var directiveNgBind = $directive('ng-bind');

    expect(_.isFunction(directiveNgBind)).toBe(true);

  });

  it('sould replace the content of the element with the data bound', function() {

    var elementRoot = document.getElementById('domStep10');
    var elementWithNgBind = document.getElementById('elementWithNgBind');

    //'Test p block' is the initial value in SpecRunner.html
    expect(elementWithNgBind.innerHTML).toBe('Test p block');

    $compile(elementRoot, scope);

    scope.$apply(function() {
      //'test.bind' is the data bound in SpecRunner.html
      scope.test = {
        bind: 'first value'
      };
    });

    expect(elementWithNgBind.innerHTML).toBe(scope.test.bind);

  });

});
