import _ from 'underscore';
import Bb from 'backbone';

// A Route is an object that is associated
// with each URL. When a URL is navigated to,
// the router transitions into the Route object,
// calling a series of callbacks.
var Route = function(options) {
  this._router = options.router;
  this.queryRefresh = false;
};

_.extend(Route.prototype, {

  // Typically you will fetch data here. It can
  // be asynchronous.
  fetch() {},

  // The show method is an opportunity to
  // display a view somewhere.
  show() {},

  // Whether or not we should transition out of
  // this state. Execute `cancel` to prevent
  // the transition.
  preventNavigation() {},

  navigate(url, options) {
    this._router.navigate(url, options);
  },

  // The error callback is executed whenever there
  // is an unhandled exception in your Route. Override
  // this behavior if you would rather handle it
  // in some other way.
  onError(e) {
    if (!console) { return; }
    console.assert(false, e, e.stack);
  }
}, Bb.Events);

Route.extend = Bb.Model.extend;

export default Route;
