describe('Route:', function () {
  beforeEach(function() {
    this.route = new Backbone.Route();
  });

  describe('When instantiating a new Route', function() {
    it('should have a show method', function() {
      expect(this.route.show).to.be.a('function');
    });
    it('should have an onFetchError method', function() {
      expect(this.route.onShowError).to.be.a('function');
    });
    it('should have a onShowError method', function() {
      expect(this.route.onFetchError).to.be.a('function');
    });
  });
});
