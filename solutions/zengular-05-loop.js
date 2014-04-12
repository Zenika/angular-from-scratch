function Scope() {
  this.$$watchers = [];
}

Scope.prototype.$watch = function (watcherFn, listenerFn) {
  var watch = {
    watcherFn: watcherFn,
    listenerFn: listenerFn
  };
  this.$$watchers.push(watch);
};

Scope.prototype.$digest = function () {
  var dirty;
  var ttl = 10;
  do {
    dirty = false;
    _.each(this.$$watchers, function (watcher) {
      var newValue = watcher.watcherFn(this);
      if (watcher.last !== newValue) {
        dirty = true;
        watcher.listenerFn(newValue, watcher.last, this);
        watcher.last = newValue;
      }
    }.bind(this));
    if (dirty && !(ttl--)) {
      throw "$digest est partie en boucle !"
    }
  } while (dirty)
};

Scope.prototype.$apply = function (exprFn) {
  try {
    exprFn();
  } finally {
    this.$digest();
  }
}
