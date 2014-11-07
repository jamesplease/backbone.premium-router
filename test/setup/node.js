var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

global._ = require('underscore');
global.Backbone = require('backbone');
global.BaseRouter = require('backbone.base-router');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.slice = Array.prototype.slice;

var namespace = process.env.APP_DIR_FOR_CODE_COVERAGE || '../../src/';
require(namespace + 'route');
require(namespace + 'state-router');

global.Route = Backbone.Route;
global.StateRouter = Backbone.StateRouter;
