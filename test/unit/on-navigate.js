import PremiumRouter from '../../src/router';
import Route from '../../src/route';

var router, fetchStub, originalFetch;
describe('PremiumRouter', () => {
  beforeEach(() => {
    router = new PremiumRouter();
  });

  describe('when transitioning away in `fetch`', () => {
    beforeEach(() => {
      stub(router, 'navigate');
      stub(router, '_onFetch');
      spy(Route.prototype, 'trigger');
      originalFetch = Route.prototype.fetch;
      Route.prototype.fetch = function() {
        this.navigate('hello/pls');
      };
      router.onNavigate({
        pizza: true,
        params: ['one', 'two', 'three'],
        linked: Route
      });
    });

    afterEach(() => {
      Route.prototype.fetch = originalFetch;
    });

    it('should call not trigger the `fetch` event on the Route', () => {
      expect(Route.prototype.trigger).to.have.not.been.calledWith('fetch');
    });
  });

  describe('when calling `onNavigate`', () => {
    beforeEach(() => {
      stub(router, '_onFetch');
      spy(router, 'onError');
      spy(Route.prototype, 'trigger');
    });

    describe('testing `onNavigate`', () => {
      beforeEach(() => {
        fetchStub = stub(Route.prototype, 'fetch').returns('lalala');
        router.onNavigate({
          pizza: true,
          params: ['one', 'two', 'three'],
          linked: Route
        });
      });

      it('should create a new instance of the linked Route, and attach it to the router', () => {
        expect(router._transitioningTo).to.be.instanceof(Route);
      });

      it('should trigger the `before:fetch` event on the route', () => {
        expect(Route.prototype.trigger)
          .to.have.been.calledOnce
          .and.to.have.been.calledWithExactly('before:fetch', {
            params: ['one', 'two', 'three']
          });
      });

      it('should trigger `before:fetch` before `fetch`', () => {
        expect(Route.prototype.trigger).to.have.been.calledBefore(Route.prototype.fetch);
      });

      it('should call the `fetch` method on the route', () => {
        expect(Route.prototype.fetch)
          .to.have.been.calledOnce
          .and.to.have.been.calledWithExactly({
            params: ['one', 'two', 'three']
          });
      });
    });

    describe('testing `_onFetch` asynchronously, when `fetch` succeeds', () => {
      beforeEach(() => {
        fetchStub = stub(Route.prototype, 'fetch').returns('lalala');
      });

      // This test is asynchronous, so we're using chai-as-promised.
      it('should call the `_onFetch` method on the router', () => {

        // First, fulfill the promise...
        return expect(router.onNavigate({
          pizza: true,
          params: ['one', 'two', 'three'],
          linked: Route
        })).to.be.fulfilled

          // And then test that our callback was executed.
          .then(() => {
            expect(router._onFetch)
              .to.have.been.calledOnce
              .and.to.have.been.calledWithExactly(
                router._transitioningTo,
                'lalala',
                { params: ['one', 'two', 'three'] }
              );
            });
      });
    });
  });
});
