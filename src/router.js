import _ from 'underscore';
import Bb from 'backbone';
import BaseRouter from 'backbone.base-router';
import Route from './route';

var ObjectRouter = BaseRouter.extend({

  // The ObjectRouter provides the ability for a Route
  // to cancel a navigation if it is not fit to be exited.
  // This is useful to ensure that a user does not, for instance,
  // leave a model unsaved.
  navigate: function(fragment, options) {

    // If there is a current route, then we are
    // given the opportunity to cancel the navigation
    if (_.result(this.currentRoute, 'preventNavigation')) {
      return this;
    }

    Bb.history.navigate(fragment, options);
    return this;
  },

  // The BaseRouter provides us a single point of
  // entry anytime a route is matched by BB.history
  onNavigate(routeData) {

    // Create a new route each time we navigate
    var newRoute = new routeData.linked();

    // Store the route we're trying to transition to. This lets
    // us know if the user transitions away at a later time.
    this._transitioningTo = newRoute;

    newRoute.trigger('before:fetch');
    Promise.resolve(newRoute.fetch).then((fetchData) => {
      this._onFetch(newRoute, fetchData, routeData);
    });
  },

  _onFetch(newRoute, fetchData, routeData) {

    // Anytime the developer has an opportunity to navigate again,
    // we need to check if they have. If they have, then we stop.
    if (this._transitioningTo !== newRoute) { return; }

    // Trigger the fetch method on the route
    newRoute.trigger('fetch');
    if (this._transitioningTo !== newRoute) { return; }
    this.currentRoute.trigger('exit');
    if (this._transitioningTo !== newRoute) { return; }
    this.currentRoute = newRoute;
    this.currentRoute.trigger('enter', routeData);

    // We can now delete the internal reference to this transition,
    // if we still have it, as the transition is complete.
    if (this._transitioningTo === newRoute) {
      delete this._transitioningTo;
    }
  }
});

ObjectRouter.Route = Route;

Bb.ObjectRouter = ObjectRouter;

export default ObjectRouter;
