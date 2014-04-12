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
  _.each(this.$$watchers, function (watcher) {
    var newValue = watcher.watcherFn(this);
    if (watcher.last !== newValue) {
      watcher.listenerFn(newValue, watcher.last, this);
      watcher.last = newValue;
    }
  }.bind(this));
};

Scope.prototype.$apply = function (exprFn) {
  try {
    exprFn();
  } finally {
    this.$digest();
  }
}
