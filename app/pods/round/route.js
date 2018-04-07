import Route from '@ember/routing/route';

export default Route.extend({

  model () {
    return this.modelFor('application')
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('model.activeOrder', 0)
    }
  }

});
