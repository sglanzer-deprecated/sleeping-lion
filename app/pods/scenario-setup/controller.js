import Controller from '@ember/controller'
import { computed } from '@ember/object'
import { inject } from '@ember/service'
import { isEmpty } from '@ember/utils'
import scenarios from 'sleeping-lion/dictionary/scenarios'
import { recommendedLevel } from 'sleeping-lion/utils/monster-level'

export default Controller.extend({

  scenario: inject(),

  scenarios,

  insufficientPlayers: computed('model.players.[]', function () {
    const players = this.get('model.players')
    if (isEmpty(players) || players.length < 2) {
      return true
    }
    return false
  }),

  recommendedMonsterLevel: computed('model.players.[]', function () {
    return recommendedLevel(this.get('model.players') || [])
  }),

  actions: {
    setPlayer (index, type, level) {
      this.get('scenario').setPlayer(index, type, level)
    },

    setScenario (scenario) {
      this.get('scenario').setScenario(scenario)
    },

    adjustMonsterLevel (adjustment) {
      this.get('scenario').adjustMonsterLevel(adjustment)
    },

    async nextStage () {
      await this.get('scenario').travel()
      this.get('scenario').reveal(this.get('model.scenario.initialTile'))
    }
  }

})
