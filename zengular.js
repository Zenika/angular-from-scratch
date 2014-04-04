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
    _.each(this.$$watchers, function (watcher) {
        var newValue = watcher.watcherFn(that);
        if (watcher.last !== newValue) {
            watcher.listenerFn(newValue, watcher.last, that);
            watcher.last = newValue;
        }
    });
};
