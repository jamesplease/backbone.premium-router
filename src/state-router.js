//
// StateRouter
// A router that manages application flow
//

var StateRouter = Backbone.StateRouter = Backbone.BaseRouter.extend({
  onNavigate: function(routeData) {
    var newRoute = routeData.linked;
    var oldRoute = this.currentRoute;

    if (!(newRoute instanceof Backbone.Route) && !(newRoute instanceof Backbone.Router)) {
      throw new Error('A Route or StateRouter must be associated with each route.');
    }

    if (this._determineRedirect(newRoute)) { return; }

    this._triggerRouteEvent(oldRoute, 'before:exit', routeData);
    this._triggerRouteEvent(newRoute, 'before:enter', routeData);

    if (!newRoute.fetch) {
      this._callShow(newRoute, oldRoute, routeData);
    } else {
      this._callFetchThenShow(newRoute, oldRoute, routeData);
    }
  },

  _determineRedirect: function(newRoute) {
    var redirects = [
      _.result(newRoute, 'redirect'),
      _.result(this, 'redirect')
    ];
    var redirect = _.find(function(val) {
      return _.isString(val);
    });
    if (redirect) {
      this.navigate(redirect, {trigger: true});
      return true;
    }
  },

  _callShow: function(newRoute, oldRoute, routeData, fetchedData) {
    newRoute.show(fetchedData, routeData);
    this.currentRoute = newRoute;
    this._triggerRouteEvent(oldRoute, 'exit', routeData);
    this._triggerRouteEvent(newRoute, 'enter', routeData);
  },

  _callFetchThenShow: function(newRoute, oldRoute, routeData) {
    // Wait for the data to come back, then
    // show the view if the route is still active.
    var router = this;
    return Promise.resolve(newRoute.fetch(routeData))
      .catch(function(e) {
        if (newRoute !== router.currentRoute) { return; }
        newRoute.onFetchError(e, routeData);
      })
      .then(function(data) {
        if (newRoute !== router.currentRoute) { return; }
        router._callShow(newRoute, oldRoute, data, routeData);
      })
      .catch(function(e) {
        newRoute.onShowError(e, routeData);
      });
  },

  _triggerRouteEvent: function(route, eventName, routeData) {
    if (!route) { return; }
    route.trigger(eventName, this, routeData);
  }
});
