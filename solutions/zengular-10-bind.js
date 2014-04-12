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

Scope.prototype.$watch = function (watcherFn, listenerFn, byValue) {
  var watch = {
    watcherFn: watcherFn,
    listenerFn: listenerFn,
    byValue: byValue
  };
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
  scope.$watch(function(scope) {
    return eval('scope.' + attributes['ng-bind'].value);
  }, function(newValue) {
    element.innerHTML = newValue;
  });
});
