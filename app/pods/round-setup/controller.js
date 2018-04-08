import Controller from '@ember/controller';
import { A } from '@ember/array'
import { computed, set } from '@ember/object'
import action from 'sleeping-lion/utils/action'

export default Controller.extend({

  initiativeSummary: computed('monsterInitiativeLockedIn', function () {
    const monsters = this.get('model.monsters')

    return Object.entries(monsters).map(([type, {initiative, eliteActions, normalActions}]) => {
      return {
        type,
        initiative,
        eliteActions,
        normalActions
      }
    })
  }),

  actions: {
    async setPlayerInitiative (player, initiative, isLongRest) {
      set(player, 'initiative', initiative)
      set(player, 'isLongRest', isLongRest)
      await this.get('model').save()
    },

    async setMonsterInitiative () {
      this.set('playerInitiativeLockedIn', true)

      const monsters = this.get('model.monsters')

      Object.entries(monsters).forEach(([, monsterModel]) => {
        // Draw a card for the monster type
        monsterModel.currentCard = monsterModel.deck.pop()
        monsterModel.initiative = monsterModel.currentCard.initiative
        monsterModel.eliteActions = action(monsterModel.monsterStats.elite, monsterModel.currentCard)
        monsterModel.normalActions = action(monsterModel.monsterStats.normal, monsterModel.currentCard)
      })

      await this.get('model').save()
      this.set('monsterInitiativeLockedIn', true)
    },

    async nextStage () {
      const scenario = this.get('model')

      const monsters = Object.entries(scenario.get('monsters')).reduce((monsters, [, monsterModel]) => {
        monsters.addObjects(A(monsterModel.elite).sortBy('standee').map(monster => {
          set(monster, 'initiative', monsterModel.initiative)
          set(monster, 'actions', monsterModel.eliteActions)
          return monster
        }))

        monsters.addObjects(A(monsterModel.normal).sortBy('standee').map(monster => {
          set(monster, 'initiative', monsterModel.initiative)
          set(monster, 'actions', monsterModel.normalActions)
          return monster
        }))

        return monsters
      }, [])

      const roundOrder = A(scenario.get('initiative'))
      roundOrder.addObjects(monsters)
      roundOrder.addObjects(scenario.get('players'))
      A(roundOrder).sort((entityA, entityB) => {
        if (entityA.initiative < entityB.initiative) {
          return -1
        }

        if (entityA.initiative > entityB.initiative) {
          return 1
        }

        if (entityA.class && !entityB.class) {
          return -1
        }

        if (!entityA.class && entityB.class) {
          return 1
        }

        if (entityA.version === 'elite' && entityB.version === 'normal') {
          return -1
        }

        if (entityA.version === 'normal' && entityB.version === 'elite') {
          return 1
        }

        if (entityA.standee && entityB.standee) {
          if (entityA.standee < entityB.standee) {
            return -1
          }

          if (entityA.standee > entityB.standee) {
            return 1
          }
        }

        return 0
      })

      await scenario.save()

      this.set('model.stage', 'round')
      this.set('model.activeOrder', 0)
      await this.get('model').save()
      this.transitionToRoute('round')
    }
  }

});
