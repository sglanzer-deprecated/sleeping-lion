import Route from '@ember/routing/route'
import { inject } from '@ember/service'
import { isNone } from '@ember/utils'

export default Route.extend({
  scenario: inject(),

  // Initialize or retrieve a scenario
  async model () {
    const models = await this.store.findAll('scenario')
    let model = models.get('firstObject')

    if (isNone(model)) {
      model = this.store.createRecord('scenario', {
        stage: 'scenario-setup',
        players: []
      })
      await model.save()
    }

    this.get('scenario').setModel(model)

    return model
  },

  afterModel (model) {
    // Handle the routing on app boot with both a fresh and updated scenario
    if (isNone(model.get('revealing'))) {
      // In a fresh scenario the stage is initialized to 'scenario-setup'
      // Otherwise, the stage is progressed as the scenario updates
      this.transitionTo(model.get('stage'))
    } else {
      // If a reveal is in progress in an updated scenario the reveal occurs
      // before transitioning to the current scenario stage (the reveal will
      // progress the scenario state)
      this.transitionTo('revealing')
    }
  }
})
