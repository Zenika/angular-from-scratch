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
  var that = this;
  _.each(this.$$watchers, function (watcher) {
    var newValue = watcher.watcherFn(that);
    if (watcher.last !== newValue) {
      watcher.listenerFn(newValue, watcher.last, that);
      watcher.last = newValue;
    }
  });
};

Scope.prototype.$apply = function (exprFn) {
  try {
    exprFn();
  } finally {
    this.$digest();
  }
}
