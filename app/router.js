import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('scenario-setup', { path: '/' });
  this.route('reveal');
  this.route('round-setup');
  this.route('round');
});

export default Router;
