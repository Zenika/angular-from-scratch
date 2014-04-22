function Scope() {
  this.$$watchers = [];
}

Scope.prototype.$watch = function (watcherExp, listenerFn) {
  if(typeof watcherExp == 'string') {
    var watcherFn = function(scope) {
      return scope[watcherExp];
    };
  } else {
    var watcherFn = watcherExp;
  }

  var watcher = {
    watcherFn: watcherFn,
    listenerFn: listenerFn
  };

  watcher.last = watcherFn(this);
  listenerFn(watcher.last, undefined, this);

  this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function () {
  this.$$watchers.forEach(function (watcher) {
    var newValue = watcher.watcherFn(this);
    if (watcher.last !== newValue) {
      watcher.listenerFn(newValue, watcher.last, this);
      watcher.last = newValue;
    }
  }.bind(this));
};

Scope.prototype.$apply = function (expressionFn) {
  try {
    if(expressionFn) {
        expressionFn();
    }
  } finally {
    this.$digest();
  }
}

var $$directives = {};

var $directive = function(name, directiveFn) {
  if(directiveFn) {
    $$directives[name] = directiveFn;
  }
  return $$directives[name];
}

var $compile = function(element, scope) {
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
  scope.$watch(attributes['ng-bind'].value, function(newValue) {
    element.innerHTML = newValue;
  });
});

$directive('ng-model', function(scope, element, attributes) {
  var value = attributes['ng-model'].value;

  scope.$watch(value, function(newValue) {
    element.value = newValue;
  });

  element.addEventListener('keyup', function() {
    scope.$apply(function() {
      scope[value] = element.value;
    });
  });
});

var scope = new Scope();
scope.title = 'toto';

$compile(document.body, scope);
