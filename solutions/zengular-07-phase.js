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
  var that = this;
  var dirty;
  var ttl = 10;
  this.$$beginPhase('$digest');
  do {
    dirty = false;
    _.each(this.$$watchers, function (watcher) {
      var newValue = watcher.watcherFn(that);
      if (watcher.byValue ? !_.isEqual(watcher.last, newValue) : watcher.last !== newValue) {
        dirty = true;
        watcher.listenerFn(newValue, watcher.last, that);
        watcher.last = watcher.byValue ? _.clone(newValue) : newValue;
      }
    });
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
