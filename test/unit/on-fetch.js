import PremiumRouter from '../../src/router';
import Route from '../../src/route';

var router, currentRoute, newRoute, thirdRoute;

// `onFetch` is the internal method that is called after the
// fetch was successful. Although it is 'internal,' it is convenient
// to test it in isolation in a synchronous environment.
describe('_onFetch', () => {
  beforeEach(() => {
    router = new PremiumRouter();
    currentRoute = new Route({ router });
    newRoute = new Route({ router });
    thirdRoute = new Route({ router });
    router._transitioningTo = newRoute;
    spy(newRoute, 'trigger');
    spy(currentRoute, 'trigger');
  });

  describe('with no current route, and the route does not redirect in any of the callbacks', () => {
    beforeEach(() => {
      router._onFetch(newRoute, 'lala', {sandwich: true});
    });

    it('should call all of the events on the new route', () => {
      expect(newRoute.trigger)
        .to.have.been.calledTwice
        .and.to.have.been.calledWithExactly('fetch', {sandwich: true}, 'lala')
        .and.to.have.been.calledWithExactly('enter', {sandwich: true}, 'lala');
    });

    it('should set the current route', () => {
      expect(router.currentRoute).to.equal(newRoute);
    });
  });

  describe('with a current route, and the route does not redirect in any of the callbacks', () => {
    beforeEach(() => {
      router.currentRoute = currentRoute;
      router._onFetch(newRoute, 'lala', {sandwich: true});
    });

    it('should trigger the `exit` event on the current route', () => {
      expect(currentRoute.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('exit');
    });

    it('should call all of the events on the new route', () => {
      expect(newRoute.trigger)
        .to.have.been.calledTwice
        .and.to.have.been.calledWithExactly('fetch', {sandwich: true}, 'lala')
        .and.to.have.been.calledWithExactly('enter', {sandwich: true}, 'lala');
    });

    it('should set the current route', () => {
      expect(router.currentRoute).to.equal(newRoute);
    });
  });

  describe('when redirecting in exit', () => {
    beforeEach(() => {
      router.currentRoute = currentRoute;

      // Redirecting effectively just sets the `_transitioningTo` property
      // on the router, so we mock that behavior here
      currentRoute.on('exit', () => {
        router._transitioningTo = thirdRoute;
      });
      router._onFetch(newRoute, 'lala', {sandwich: true});
    });

    it('should trigger the `exit` event on the current route', () => {
      expect(currentRoute.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('exit');
    });

    it('should trigger the `fetch` event on the new route', () => {
      expect(newRoute.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('fetch', {sandwich: true}, 'lala');
    });

    it('should not call the `enter` event on the new route', () => {
      expect(newRoute.trigger)
        .to.not.have.been.calledWithExactly('enter', {sandwich: true}, 'lala');
    });

    it('should not change the currentRoute', () => {
      expect(router.currentRoute).to.equal(currentRoute);
    });
  });

  describe('when redirecting in `fetch` with a currentRoute', () => {
    beforeEach(() => {
      router.currentRoute = currentRoute;
      // Redirecting effectively just sets the `_transitioningTo` property
      // on the router, so we mock that behavior here
      newRoute.on('fetch', () => {
        router._transitioningTo = thirdRoute;
      });
      router._onFetch(newRoute, 'lala', {sandwich: true});
    });

    it('should not trigger the `exit` event on the current route', () => {
      expect(currentRoute.trigger).to.not.have.been.called;
    });

    it('should trigger the `fetch` event on the new route', () => {
      expect(newRoute.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('fetch', {sandwich: true}, 'lala');
    });

    it('should not call the `enter` event on the new route', () => {
      expect(newRoute.trigger)
        .to.not.have.been.calledWithExactly('enter', {sandwich: true}, 'lala');
    });

    it('should not change the currentRoute', () => {
      expect(router.currentRoute).to.equal(currentRoute);
    });
  });

  describe('when redirecting in `enter` with a currentRoute', () => {
    beforeEach(() => {
      router.currentRoute = currentRoute;
      // Redirecting effectively just sets the `_transitioningTo` property
      // on the router, so we mock that behavior here
      newRoute.on('enter', () => {
        router._transitioningTo = thirdRoute;
      });
      router._onFetch(newRoute, 'lala', {sandwich: true});
    });

    it('should trigger the `exit` event on the current route', () => {
      expect(currentRoute.trigger)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('exit');
    });

    it('should call all of the events on the new route', () => {
      expect(newRoute.trigger)
        .to.have.been.calledTwice
        .and.to.have.been.calledWithExactly('fetch', {sandwich: true}, 'lala')
        .and.to.have.been.calledWithExactly('enter', {sandwich: true}, 'lala');
    });

    it('should have set the current route to be the new route', () => {
      expect(router.currentRoute).to.equal(newRoute);
    });
  });
});
