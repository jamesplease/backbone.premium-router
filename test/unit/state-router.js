describe('Router:', function () {
  beforeEach(function() {
    this.router = new Backbone.StateRouter();
  });

  afterEach(function() {
    delete this.router.currentRoute;
  });

  describe('a matched URI without a route or router', function() {
    it('should throw an error', function() {
      expect(_.partial(this.router.onNavigate, {linked: 'pasta'}))
        .to.throw(Error, 'A Route or StateRouter must be associated with each route.');
    });
  });

  describe('a matched route without a fetch method', function() {
    beforeEach(function() {
      this.route = new Backbone.Route();
      this.sinon.spy(this.route, 'show');
      this.router.onNavigate({linked: this.route});
    });

    it('should call show', function() {
      expect(this.route.show).to.have.been.calledOnce;
    });
  });

  describe('a matched route with a synchronous fetch method', function() {
    beforeEach(function() {
      this.Route = Backbone.Router.extend({
        fetch: function() {
          return 'simile';
        }
      });
      this.route = new this.Route();
      this.stub(this.route, 'fetch');
    });

    it('should call show', function() {
      return expect(this)
      expect(this.routeOne.show).to.have.been.calledOnce;
    });
  });
});
