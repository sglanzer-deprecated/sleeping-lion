import Route from '@ember/routing/route'
import { A } from '@ember/array'
import { isNone } from '@ember/utils'

export default Route.extend({
  model () {
    return this.modelFor('application')
  },

  setupController (controller, model) {
    this._super(controller, model)

    const playerInitiativeLockedIn = A(model.get('players')).every(player => {
      return isNone(player.initiative) === false
    })
    controller.set('playerInitiativeLockedIn', playerInitiativeLockedIn)
  },

  resetController (controller, isExiting) {
    if (isExiting) {
      controller.set('playerInitiativeLockedIn', false)
      controller.set('monsterInitiativeLockedIn', false)
    }
  }

});
