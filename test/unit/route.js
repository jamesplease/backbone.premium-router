import ObjectRouter from '../../src/router';
import Route from '../../src/route';

describe('the Router', () => {
  it('should have the Route attached to it', () => {
    expect(ObjectRouter.Route).to.deep.equal(Route);
  });
});
