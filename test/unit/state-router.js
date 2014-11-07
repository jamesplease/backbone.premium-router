describe('Router:', function () {
  beforeEach(function() {
    this.routeOne = new Backbone.Route();
    this.routeTwo = new Backbone.Route();
    this.router = new Backbone.StateRouter();
    this.sinon.spy(this.routeOne, 'show');
  });

  describe('a matched route without a fetch method', function() {
    beforeEach(function() {
      Backbone.history.location = new this.Location('http://example.com#home');
      this.router.route('home', this.routeOne);
      Backbone.history.start();
    });

    it('should call show', function() {
      expect(this.routeOne.show).to.have.been.calledOnce;
    });
  });
});
