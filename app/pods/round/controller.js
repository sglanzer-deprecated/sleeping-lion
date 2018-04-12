import Controller from '@ember/controller'
import { computed } from '@ember/object'
import { inject } from '@ember/service'
import { types } from 'sleeping-lion/dictionary/infusions'

export default Controller.extend({
  scenario: inject(),

  infusions: types,

  actionsPerMonsterType: computed('model.roundOrder', function () {
    const monsterModels = this.get('model.monsterModels')
    return Object.entries(monsterModels).map(([type, { actions }]) => {
      return {
        type,
        actions
      }
    })
  }),

  actions: {
    reveal () {
      this.transitionToRoute('round.reveal')
    },

    infuse (infusion) {
      this.get('scenario').infuse(infusion)
    },

    consume (infusion) {
      this.get('scenario').consume(infusion)
    },

    target (entity) {
      this.get('scenario').target(entity)
    },

    damage (entity, hp) {
      this.get('scenario').damage(entity, hp)
    },

    heal (entity, hp) {
      this.get('scenario').heal(entity, hp)
    },

    toggleCondition (entity, condition) {
      this.get('scenario').toggleCondition(entity, condition)
    },

    advanceRoundOrder () {
      this.get('scenario').advanceRoundOrder()
    }
  }

});
