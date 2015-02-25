import _ from 'underscore';
import Bb from 'backbone';

// A Route is an object that is associated
// with each URL. When a URL is navigated to,
// the router transitions into the Route object,
// calling a series of callbacks.
var Route = function() {};

_.extend(Route.prototype, {
  show() {},
  onError(e) {
    if (!console) { return; }
    console.assert(false, e, e.stack);
  }
}, Bb.Events);

Route.extend = Bb.Model.extend;
