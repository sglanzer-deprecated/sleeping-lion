import Route from '@ember/routing/route';

export default Route.extend({

  model () {
    return this.modelFor('application')
  },

  afterModel (model) {
    if (model.get('stage') !== 'scenario-setup') {
      this.transitionTo(model.get('stage'))
    }
  }

});
