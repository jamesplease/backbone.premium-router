import _ from 'underscore';
import Bb from 'backbone';
import BaseRouter from 'backbone.base-router';
import Route from './route';

var PremiumRouter = BaseRouter.extend({

  // The PremiumRouter provides the ability for a Route
  // to cancel a navigation if it is not fit to be exited.
  // This is useful to ensure that a user does not, for instance,
  // leave a model unsaved.
  navigate: function(fragment, options) {

    // If there is a current route, then we are
    // given the opportunity to cancel the navigation
    if (_.result(this.currentRoute, 'preventNavigation') === true) {
      return this;
    }

    Bb.history.navigate(fragment, options);
    return this;
  },

  // The BaseRouter provides us a single point of
  // entry anytime a route is matched by BB.history
  onNavigate(routeData) {

    // Create a new route each time we navigate
    var newRoute = new routeData.linked({
      router: this
    });

    // Remove unnecessary pieces from the routeData
    routeData = _.pick(routeData, 'params', 'query', 'uriFragment');

    // Store the route we're trying to transition to. This lets
    // us know if the user transitions away at a later time.
    this._transitioningTo = newRoute;

    newRoute.trigger('before:fetch', routeData);

    // Coerce the fetch method to a promise, so that it can be sync or async.
    return Promise.resolve(newRoute.fetch(routeData))

      // If it's successful, then we move along to the `_onFetch` callback.
      .then(fetchData => {
        this._onFetch(newRoute, fetchData, routeData);
      })

      // If there are errors at any time, then we look for an `onError`
      // method of the Route. If it exists, we execute it; otherwise, we
      // use the Router's `onError` callback.
      .catch(e => {
        if (newRoute.onError) {
          newRoute.onError(e, routeData);
        } else {
          this.onError(e, routeData);
        }
      });
  },

  _onFetch(newRoute, fetchData, routeData) {

    // Anytime the developer has an opportunity to navigate again,
    // we need to check if they have. If they have, then we stop.
    // As you can see below, we must do this check multiple times in
    // this callback.
    if (this._transitioningTo !== newRoute) { return; }

    // Trigger the fetch method on the route
    newRoute.trigger('fetch', routeData, fetchData);
    if (this._transitioningTo !== newRoute) { return; }

    // Trigger the exit method on the current route,
    // if it exists
    if (this.currentRoute) {
      this.currentRoute.trigger('exit');
    }
    if (this._transitioningTo !== newRoute) { return; }

    this.currentRoute = newRoute;
    this.currentRoute.trigger('enter', routeData, fetchData);

    // We can now delete the internal reference to this transition,
    // if we still have it, as the transition is complete.
    if (this._transitioningTo === newRoute) {
      delete this._transitioningTo;
    }
  },

  // The error callback is executed whenever there
  // is an unhandled exception in your Route.
  // You can specify an `onError` callback in a
  // route for per-route handling, or override this method
  // to modify the default handling of errors.
  onError(e, routeData) {
    if (!console) { return this; }
    console.assert(false, e, e.stack);
    return this;
  }
});

PremiumRouter.Route = Route;

Bb.PremiumRouter = PremiumRouter;

export default PremiumRouter;
