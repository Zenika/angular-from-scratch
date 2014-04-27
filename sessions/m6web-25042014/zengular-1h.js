$parse = function(expression) {

  var result = function(scope) {
    return scope[expression];
  }

  result.assign = function(scope, newValue) {
    scope[expression] = newValue;
  }

  return result;

}

function Scope() {
  this.$$watchers = [];
}

Scope.prototype.$watch = function(watcher, listenerFn) {
  if(typeof watcher == 'string') {
    var watcherFn = $parse(watcher);
  } else {
    var watcherFn = watcher;
  }

  this.$$watchers.push({
    watcherFn: watcherFn,
    listenerFn: listenerFn
  })
}

Scope.prototype.$digest = function() {
  this.$$watchers.forEach(function(watch) {
    var newValue = watch.watcherFn(this);
    var oldValue = watch.last;
    if(newValue != oldValue) {
      watch.listenerFn(newValue, oldValue, this);
      watch.last = newValue;
    }
  }.bind(this));
}

Scope.prototype.$apply = function(exprFn) {
  try {
    exprFn();
  } finally {
    this.$digest();
  }
}

$$directives = {};

$directive = function(name, directiveFn) {
  if(directiveFn) {
    $$directives[name] = directiveFn;
  }
  return $$directives[name];
}

$compile = function(element, scope) {
  //console.log(element);

  element.children.forEach = Array.prototype.forEach;
  element.attributes.forEach = Array.prototype.forEach;

  element.children.forEach(function(child) {
    $compile(child, scope);
  });

  element.attributes.forEach(function(attribute) {
    var directiveFn = $directive(attribute.name);
    if(directiveFn) {
      directiveFn(scope, element, element.attributes);
    }
  });

}


$directive('ng-bind', function(scope, element, attributes) {
  scope.$watch(attributes['ng-bind'].value, function(newValue) {
    element.innerHTML = newValue;
  });
});

$directive('ng-model', function(scope, element, attributes) {
  scope.$watch(attributes['ng-model'].value, function(newValue) {
    element.value = newValue;
  });

  element.addEventListener('keyup', function() {
    scope.$apply(function() {
      $parse(attributes['ng-model'].value).assign(scope, element.value);
    });
  });
});





var $scope = new Scope();

$compile(document.body, $scope);

$scope.$watch('title', function(newValue, oldValue) {
  console.log('listened title', oldValue, '->', newValue);
});


$scope.$apply(function() {
  $scope.title = 'M6Web';
});


$scope.$apply(function() {
  $scope.title = 'M6Web !!';
});
