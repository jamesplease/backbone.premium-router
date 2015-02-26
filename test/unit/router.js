import ObjectRouter from '../../src/router';
import Route from '../../src/route';

var router;
describe('ObjectRouter', () => {
  beforeEach(() => {
    router = new ObjectRouter({
      routes: {
        'hello/there/friendo': Route
      }
    });

    sinon.spy(Route.prototype.fetch);
  });

  it('should call the fetch method', () => {
    expect(ObjectRouter.Route).to.deep.equal(Route);
  });
});
