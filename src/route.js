import _ from 'underscore';
import Bb from 'backbone';

// A Route is an object that is associated
// with each URL. When a URL is navigated to,
// the router transitions into the Route object,
// calling a series of callbacks.
var Route = function(options) {
  this._router = options.router;
};

_.extend(Route.prototype, {

  // Typically you will fetch data here. It can
  // be asynchronous.
  fetch() {},

  navigate(url, options) {
    this._router.navigate(url, options);
    return this;
  }
}, Bb.Events);

Route.extend = Bb.Model.extend;

export default Route;
