import Controller from '@ember/controller';
import scenarios from 'sleeping-lion/dictionary/scenarios'
import monsters from 'sleeping-lion/dictionary/monsters'
import { A } from '@ember/array'
import { computed } from '@ember/object'
import { isNone } from '@ember/utils';
import { assign } from '@ember/polyfills'

export default Controller.extend({

  tile: computed(function () {
    const scenario = A(scenarios).findBy('number', this.get('model.number'))
    const tile = A(scenario.tiles).findBy('id', this.get('model.reveal'))
    return tile
  }),

  monsterTokens: computed('tile', function () {
    const scenario = this.get('model')
    const monsterLevel = scenario.get('monsterLevel')

    const tile = this.get('tile')
    if (isNone(tile)) {
      return []
    }

    const playerCount = this.get('model.players.length')
    return A(tile.monsterTokens[playerCount]).reduce((monsterTokens, {type, elite, normal}) => {
      // Create an array of standee numbers
      const standees = []
      for (let number = 1; number <= monsters[type].standees; number++) {
        standees.push(number);
      }

      // Shuffle the array
      for (let index = standees.length - 1; index > 0; index--) {
        let exchangeIndex = Math.floor(Math.random() * (index + 1));
        [standees[index], standees[exchangeIndex]] = [standees[exchangeIndex], standees[index]];
      }

      const eliteStandees = []
      for (let number = 0; number < elite; number++) {
        eliteStandees.push(standees.pop());
      }

      const normalStandees = []
      for (let number = 0; number < normal; number++) {
        normalStandees.push(standees.pop());
      }

      // Save the monsters and remaining standees to the scenario
      const monsterStats = monsters[type].level[monsterLevel]
      const scenarioMonsters = scenario.get('monsters')

      // Shuffle the monster deck
      const monsterDeck = monsters[type].deck.slice()
      for (let index = monsterDeck.length - 1; index > 0; index--) {
        let exchangeIndex = Math.floor(Math.random() * (index + 1));
        [monsterDeck[index], monsterDeck[exchangeIndex]] = [monsterDeck[exchangeIndex], monsterDeck[index]];
      }

      scenarioMonsters[type] = {
        deck: monsterDeck,
        standees,
        monsterStats,
        currentCard: null,
        initiative: null,
        eliteActions: null,
        normalActions: null,
        elite: eliteStandees.map(standee => {
          return {
            type: 'elite',
            standee,
            hp: monsterStats.elite.hp,
            modifiedStats: null,
            conditions: []
          }
        }),
        normal: normalStandees.map(standee => {
          return {
            type: 'normal',
            standee,
            hp: monsterStats.normal.hp,
            modifiedStats: null,
            conditions: []
          }
        })
      }
      scenario.save()

      monsterTokens.push({
        type,
        elite: eliteStandees,
        normal: normalStandees
      })

      return monsterTokens
    }, [])
  }),

  actions: {
    async nextStage () {
      this.set('model.reveal', null)
      await this.get('model').save()
      this.transitionToRoute(this.get('model.stage'))
    }
  }
});
