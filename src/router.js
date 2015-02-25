import _ from 'underscore';
import Bb from 'backbone';
import BaseRouter from 'backbone.base-router';
import Route from './route';

var ObjectRouter = BaseRouter.extend({
  onNavigate(routeData) {
    var newRoute = routeData.linked;

    if (!(newRoute instanceof Route)) {
      throw new Error('A Route object must be associated with each route.');
    }

    var redirect = newRoute.redirect;
    if (_.isFunction(redirect)) { redirect = redirect(routeData); }
    if (_.isString(redirect)) {
      this.navigate(redirect, {trigger:true});
      newRoute.trigger('redirect', routeData);
      this.trigger('redirect', routeData);
      return;
    }

    if (this.authenticate && !this.authenticate(routeData)) {
      newRoute.trigger('unauthorized', routeData);
      this.trigger('unauthorized', routeData);
      return;
    }

    if (this.currentRoute) {
      this.currentRoute.trigger('exit', routeData);
    }
    this.currentRoute = newRoute;
    newRoute.trigger('enter', routeData);

    if (!newRoute.fetch) {
      newRoute.show(undefined, routeData);
      newRoute.trigger('show', routeData);
    } else {

      // Wait for the data to come back, then
      // show the view if the route is still active.
      Promise.resolve(newRoute.fetch(routeData))
        .then(data => {
          newRoute.trigger('fetch', routeData, data);
          if (newRoute !== this.currentRoute) { return; }
          newRoute.show(data, routeData);
          newRoute.trigger('show', routeData);
        })
        .catch(e => {
          if (newRoute !== this.currentRoute) { return; }
          newRoute.trigger('error', e, routeData);
        });
    }
  }
});

ObjectRouter.Route = Route;

Bb.ObjectRouter = ObjectRouter;

export default ObjectRouter;
