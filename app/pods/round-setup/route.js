import Route from '@ember/routing/route';

export default Route.extend({

  async model () {
    const scenario = this.modelFor('application')
    scenario.set('initiative', [])
    await scenario.save()
    return scenario
  },

  resetController (controller, isExiting) {
    if (isExiting) {
      controller.set('initiativeSummary', [])
    }
  }

});
