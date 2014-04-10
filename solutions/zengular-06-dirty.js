function Scope() {
  this.$$watchers = [];
}

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
