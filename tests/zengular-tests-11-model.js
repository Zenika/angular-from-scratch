describe('the tests of the step 11 of the workshop', function() {

  beforeEach(function() {

    scope = new Scope();

    var elementNgModel = document.getElementById('elementWithNgModel');

    elementNgModel.value = '';

  });

  it('sould add a directive called ng-model', function() {

    var directiveNgModel = $directive('ng-model');

    expect(_.isFunction(directiveNgModel)).toBe(true);

  });

  it('sould replace value by the scope value and replace the scope value on keyup events', function() {

    var elementRoot = document.getElementById('domStep11');
    var elementWithNgModel = document.getElementById('elementWithNgModel');

    //'Test p block' is the initial value in SpecRunner.html
    expect(elementWithNgModel.value).toBe('');

    $compile(elementRoot, scope);

    scope.$apply(function() {
      //'test.bind' is the data bound in SpecRunner.html
      scope.test = {
        bind: 'first value'
      };
    });

    expect(elementWithNgModel.value).toBe(scope.test.bind);

    elementWithNgModel.value = 'second value';

    var event = new CustomEvent("keyup");
    elementWithNgModel.dispatchEvent(event);

    expect(scope.test.bind).toBe(elementWithNgModel.value);

  });

});
