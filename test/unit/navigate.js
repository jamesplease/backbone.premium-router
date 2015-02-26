import Bb from 'backbone';
import ObjectRouter from '../../src/router';
import Route from '../../src/route';

var router, route;
describe('navigate', () => {
  describe('from a Route', () => {
    beforeEach(() => {
      router = new ObjectRouter();
      route = new Route({ router });
      stub(router, 'navigate');
      route.navigate('hello', {sandwiches: 'areGood'});
    });

    it('should forward the request to the routers navigate method', () => {
      expect(router.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {sandwiches: 'areGood'});
    });
  });

  describe('from a router', () => {
    beforeEach(() => {
      router = new ObjectRouter();
      stub(Bb.history, 'navigate');
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should forward the request to Bb.history', () => {
      expect(Bb.history.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {pasta: 'pls'});
    });
  });

  describe('from a router with a route with no `preventNavigation` method', () => {
    beforeEach(() => {
      router = new ObjectRouter();
      route = new Route({ router });
      stub(Bb.history, 'navigate');
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should forward the request to Bb.history', () => {
      expect(Bb.history.navigate)
        .to.have.been.calledOnce
        .and.to.have.been.calledWithExactly('hello', {pasta: 'pls'});
    });
  });

  describe('from a router with a route with a `preventNavigation` method that returns false', () => {
    beforeEach(() => {
      router = new ObjectRouter();
      route = new Route({ router });
      route.preventNavigation = function() { return false; };
      stub(Bb.history, 'navigate');
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
      router = new ObjectRouter();
      route = new Route({ router });
      route.preventNavigation = function() { return true; };
      stub(Bb.history, 'navigate');
      router.navigate('hello', {pasta: 'pls'});
    });

    it('should not forward the request to Bb.history', () => {
      expect(Bb.history.navigate).to.not.have.beenCalled;
    });
  });
});
