import Controller from '@ember/controller'
import { computed } from '@ember/object'
import { inject } from '@ember/service'

export default Controller.extend({

  scenario: inject(),

  monsterSummary: computed('model.playerInitiativeLocked', function () {
    const monsterModels = this.get('model.monsterModels')

    return Object.entries(monsterModels).map(([type, {initiative, actions}]) => {
      return {
        type,
        initiative,
        actions
      }
    })
  }),

  actions: {
    async setPlayerInitiative (player, initiative, isLongRest) {
      this.get('scenario').setPlayerInitiative(player, initiative, isLongRest)
    },

    async drawMonsterCards () {
      this.get('scenario').drawMonsterCards()
    },

    async nextStage () {
      this.get('scenario').fight()
    }
  }

})
