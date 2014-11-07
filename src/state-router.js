//
// StateRouter
// A router that manages application flow
//

var StateRouter = Backbone.StateRouter = Backbone.BaseRouter.extend({
  onNavigate: function(routeData) {
    var newRoute = routeData.linked;
    var oldRoute = this.currentRoute;

    if (!(newRoute instanceof Route)) {
      throw new Error('A Route object must be associated with each route.');
    }

    var redirects = [
      _.result(newRoute, 'redirect'),
      _.result(this, 'redirect')
    ];
    var redirect = _.find(function(val) {
      return _.isString(val);
    });
    if (redirect) {
      this.navigate(redirect, {trigger: true});
      return;
    }

    this._triggerRouteEvent(oldRoute, 'before:exit', routeData);
    this._triggerRouteEvent(newRoute, 'before:enter', routeData);

    if (!newRoute.fetch) {
      newRoute.show(undefined, routeData);
      this.currentRoute = newRoute;
      this._triggerRouteEvent(oldRoute, 'exit', routeData);
      this._triggerRouteEvent(newRoute, 'enter', routeData);
    } else {

      // Wait for the data to come back, then
      // show the view if the route is still active.
      var router = this;
      Promise.resolve(newRoute.fetch(routeData))
        .catch(function(e) {
          if (newRoute !== router.currentRoute) { return; }
          newRoute.onFetchError(e, routeData);
        })
        .then(function(data) {
          if (newRoute !== router.currentRoute) { return; }
          newRoute.show(data, routeData);
          this.currentRoute = newRoute;
          this._triggerRouteEvent(oldRoute, 'exit', routeData);
          this._triggerRouteEvent(newRoute, 'enter', routeData);
        })
        .catch(function(e) {
          newRoute.onShowError(e, routeData);
        });
    }
  },

  _triggerRouteEvent: function(route, eventName, routeData) {
    if (!route) { return; }
    route.trigger(eventName, this, routeData);
  }
});
