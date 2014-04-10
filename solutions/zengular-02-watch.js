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
