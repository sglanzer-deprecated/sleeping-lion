import Controller from '@ember/controller';
import { assign } from '@ember/polyfills'
import { A } from '@ember/array'
import { isNone, isEmpty } from '@ember/utils'
import { computed, set } from '@ember/object'
import action from 'sleeping-lion/utils/action'

export default Controller.extend({

  monsterActions: computed('model.initiative', function () {
    const scenarioInitiatives = this.get('model.initiative')
    if (isEmpty(scenarioInitiatives)) {
      return []
    }

    return []
  }),

  actions: {
    setPlayerInitiative (player, initiative, isLongRest) {
      const scenarioInitiatives = this.get('model.initiative')
      const playerInitiative = A(scenarioInitiatives).findBy('class', player.class)
      if (isNone(playerInitiative)) {
        scenarioInitiatives.push(assign({initiative, isLongRest}, player))
      } else {
        const index = scenarioInitiatives.indexOf(playerInitiative)
        scenarioInitiatives.splice(index, 1)
        playerInitiative.initiative = initiative
        playerInitiative.isLongRest = isLongRest
        scenarioInitiatives.push(playerInitiative)
      }
      this.set('model.initiative', scenarioInitiatives)
      this.get('model').save()
    },

    async setMonsterInitiative () {
      const monsters = this.get('model.monsters')
      const initiativeSummary = Object.entries(monsters).map(([type, monsterModel]) => {
        // Draw a card for the monster type
        monsterModel.currentCard = monsterModel.deck.pop()
        monsterModel.initiative = monsterModel.currentCard.initiative
        monsterModel.eliteActions = monsterModel.elite.length > 0 ? action(monsterModel.monsterStats.elite, monsterModel.currentCard) : null
        monsterModel.normalActions = monsterModel.normal.length > 0 ? action(monsterModel.monsterStats.normal, monsterModel.currentCard) : null

        return {
          type,
          initiative: monsterModel.initiative,
          eliteActions: monsterModel.eliteActions,
          normalActions: monsterModel.normalActions
        }
      })

      await this.get('model').save()
      this.set('initiativeSummary', initiativeSummary)
    },

    async nextStage () {
      const scenario = this.get('model')

      const monsterOrder = Object.entries(scenario.get('monsters')).reduce((monsters, [type, monsterModel]) => {
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

      const initiative = A(scenario.get('initiative'))
      initiative.addObjects(monsterOrder)
      await scenario.save()

      this.set('model.stage', 'round')
      this.set('model.activeOrder', 0)
      await this.get('model').save()
      this.transitionToRoute('round')
    }
  }

});
