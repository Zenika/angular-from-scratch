describe('the tests of the step 8 of the workshop', function() {

  it('sould add an object $$directives and a function $directive', function() {

    expect(_.isObject($$directives)).toBe(true);

    expect(_.isFunction($directive)).toBe(true);

  });

  it('sould register the directive function when using $directive function', function() {

    var directiveName = 'directive-test';
    var directiveFunction = function() {};

    $directive(directiveName, directiveFunction);

    expect($$directives[directiveName]).toBe(directiveFunction);

    expect($directive(directiveName)).toBe(directiveFunction);

  });

});
