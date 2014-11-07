//
// Route
// In a traditional Backbone router, callbacks are associated
// with URIs. With StateRouter, Routes are associated with URIs.
//

var Route = Backbone.Route = function() {};

function onFail(e) {
  if (!console || !console.assert) { return; }
  console.assert(false, e);
}

_.extend(Route.prototype, Backbone.Events, {
  show: function() {},
  onFetchError: onFail,
  onShowError: onFail
});
