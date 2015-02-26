import Bb from 'backbone';
import ObjectRouter from '../../src/router';
import Route from '../../src/route';

var router, route;
describe('navigate', () => {
  beforeEach(() => {
    router = new ObjectRouter();
    route = new Route({ router });
  });

  describe('from a Route', () => {
    beforeEach(() => {
      stub(router, 'navigate');
      spy(route, 'navigate');
      route.navigate('hello', {sandwiches: 'areGood'});
    });

    it('should forward the request to the routers navigate method', () => {
      expect(router.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {sandwiches: 'areGood'});
    });

    it('should return the route instance', () => {
      expect(route.navigate)
        .to.have.been.calledOnce
        .and.to.have.always.returned(route);
    });
  });

  describe('from a router', () => {
    beforeEach(() => {
      stub(Bb.history, 'navigate');
      spy(router, 'navigate');
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should forward the request to Bb.history', () => {
      expect(Bb.history.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {pasta: 'pls'});
    });

    it('should return the router instace', () => {
      expect(router.navigate)
        .to.have.been.calledOnce
        .and.to.have.always.returned(router);
    });
  });

  describe('from a router with a route with no `preventNavigation` method', () => {
    beforeEach(() => {
      stub(Bb.history, 'navigate');
      spy(router, 'navigate');
      router.currentRoute = route;
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should forward the request to Bb.history', () => {
      expect(Bb.history.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {pasta: 'pls'});
    });

    it('should return the router instace', () => {
      expect(router.navigate)
        .to.have.been.calledOnce
        .and.to.have.always.returned(router);
    });
  });

  describe('from a router with a route with a `preventNavigation` method that returns false', () => {
    beforeEach(() => {
      router.currentRoute = route;
      route.preventNavigation = function() { return false; };
      stub(Bb.history, 'navigate');
      spy(router, 'navigate');
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should forward the request to Bb.history', () => {
      expect(Bb.history.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {pasta: 'pls'});
    });
  });

  describe('from a router with a route with a `preventNavigation` method that returns true', () => {
    beforeEach(() => {
      router.currentRoute = route;
      route.preventNavigation = function() { return true; };
      stub(Bb.history, 'navigate');
      spy(router, 'navigate');
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should not forward the request to Bb.history', () => {
      expect(Bb.history.navigate).to.not.have.been.called;
    });

    it('should return the router instace', () => {
      expect(router.navigate)
        .to.have.been.calledOnce
        .and.to.have.always.returned(router);
    });
  });
});
