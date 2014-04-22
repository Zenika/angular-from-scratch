var $parse = function(string) {
  var list = string.split('.');
  var chain = list.splice(0, list.length - 1);
  var last = list[0];

  function reduce(scope) {
    return chain.reduce(function(accu, value) {
      return accu[value];
    }, scope);
  }

  var result = function(scope) {
    return reduce(scope)[last];
  }
  result.assign = function(scope, value) {
    return reduce(scope)[last] = value;
  }
  return result;
}

function Scope() {
  this.$$watchers = [];
  this.$$phase = null;
}

Scope.prototype.$$beginPhase = function(phase) {
  if (this.$$phase) {
    throw this.$$phase + " est déjà en cours...";
  }
  this.$$phase = phase;
};

Scope.prototype.$$clearPhase = function() {
    this.$$phase = null;
};

Scope.prototype.$watch = function (watcherExp, listenerFn, byValue) {
  if(_.isString(watcherExp)) {
    var watcherFn = $parse(watcherExp);
  } else {
    var watcherFn = watcherExp;
  }

  var watch = {
    watcherFn: watcherFn,
    listenerFn: listenerFn,
    byValue: byValue
  };

  watch.last = watcherFn(this);
  listenerFn(watch.last, undefined, this);

  this.$$watchers.push(watch);
};

Scope.prototype.$digest = function () {
  var dirty;
  var ttl = 10;
  this.$$beginPhase('$digest');
  do {
    dirty = false;
    _.each(this.$$watchers, function (watcher) {
      var newValue = watcher.watcherFn(this);
      if (watcher.byValue ? !_.isEqual(watcher.last, newValue) : watcher.last !== newValue) {
        dirty = true;
        watcher.listenerFn(newValue, watcher.last, this);
        watcher.last = watcher.byValue ? _.clone(newValue) : newValue;
      }
    }.bind(this));
    if (dirty && !(ttl--)) {
      this.$$clearPhase();
      throw "$digest est partie en boucle !"
    }
  } while (dirty)
  this.$$clearPhase();
};

Scope.prototype.$apply = function (exprFn) {
  try {
    exprFn();
  } finally {
    this.$digest();
  }
}

var $$directives = {};

var $directive = function(name, directiveFn) {
  if(_.isFunction(directiveFn)) {
    $$directives[name] = directiveFn;
  }
  return $$directives[name];
}

var $compile = function(element, scope) {
  //console.log(element, scope);
  _.each(element.children, function(child) {
    $compile(child, scope);
  });
  _.each(element.attributes, function(attribute) {
    var directiveFn = $directive(attribute.name);
    if(_.isFunction(directiveFn)) {
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
  var value = $parse(attributes['ng-model'].value);

  scope.$watch(value, function(newValue) {
    element.value = newValue;
  });

  element.addEventListener('keyup', function() {
    scope.$apply(function() {
      value.assign(scope, element.value);
    });
  });
});

$directive('ng-click', function(scope, element, attributes) {
  element.addEventListener('click', function() {
    scope.$apply(function() {
      eval('scope.' + attributes['ng-click'].value);
    });
  });
});

var scope = new Scope();
scope.workshop = {title : 'toto'};

$compile(document.body, scope);
