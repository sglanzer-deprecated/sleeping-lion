import Controller from '@ember/controller'
import scenarios from 'sleeping-lion/dictionary/scenarios'
import monsters from 'sleeping-lion/dictionary/monsters'
import { A } from '@ember/array'
import { computed, get, set } from '@ember/object'
import { isNone } from '@ember/utils'
import action from 'sleeping-lion/utils/action'

export default Controller.extend({

  tile: computed('model.reveal', function () {
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

    const playerCount = this.get('model.playerCount')
    return A(tile.monsterTokens[playerCount]).reduce((monsterTokens, {type, elite, normal}) => {
      // Create an array of standee numbers
      const standees = A([])
      for (let number = 1; number <= monsters[type].standees; number++) {
        standees.push(number);
      }

      // Remove any standees already in use
      const previousMonsters = get(scenario, `monsters.${type}`)
      if (previousMonsters) {
        get(previousMonsters, 'elite').forEach(({standee}) => {
          standees.removeObject(standee)
        })

        get(previousMonsters, 'normal').forEach(({standee}) => {
          standees.removeObject(standee)
        })
      }

      // TODO: Place only the standees that are available, starting with the monsters closest to the revealing character

      // Shuffle the remaining standee array
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

      if (previousMonsters) {
        const newElites = eliteStandees.map(standee => {
          return {
            type,
            version: 'elite',
            standee,
            hp: monsterStats.elite.hp,
            modifiedStats: null,
            conditions: [],
            initiative: previousMonsters.initiative,
            actions: previousMonsters.eliteActions
          }
        })

        get(previousMonsters, 'elite').push(newElites)

        const newNormals = normalStandees.map(standee => {
          return {
            type,
            version: 'normal',
            standee,
            hp: monsterStats.normal.hp,
            modifiedStats: null,
            conditions: [],
            initiative: previousMonsters.initiative,
            actions: previousMonsters.normalActions
          }
        })

        get(previousMonsters, 'normal').push(newNormals)

        // If a round is in progress insert the monsters into the round order
        if (get(scenario, 'stage') === 'round') {
          const revealingPlayerInitiative = scenario.get('initiative')[scenario.get('activeOrder')].initiative

          if (previousMonsters.initiative < revealingPlayerInitiative) {
            const newMonsters = []
            newMonsters.push(...A(newElites).sortBy('standee'))
            newMonsters.push(...A(newNormals).sortBy('standee'))
            scenario.get('initiative').splice(scenario.get('activeOrder') + 1, 0, ...newMonsters)
          } else {
            const sortedElites = A(newElites).sortBy('standee')
            const sortedNormals = A(newNormals).sortBy('standee')

            // Find the first monster of this type or the initiative position if
            // there isn't once (all previous monsters killed in the round)
            const firstOfType = scenario.get('initiative').find(entity => entity.type === type)
            if (firstOfType) {
              sortedElites.forEach(elite => {
                for (let currentIndex = scenario.get('initiative').indexOf(firstOfType);
                         currentIndex <= scenario.get('initiative').length;
                         currentIndex++) {
                  if (currentIndex === scenario.get('initiative').length) {
                    // Past all existing monsters, put it at the end
                    scenario.get('initiative').push(elite)
                    return
                  } else {
                    // Compare with the monster at the current index
                    const otherMonster = scenario.get('initiative')[currentIndex]
                    if (otherMonster.type !== type) {
                      // Reached the end of our type of monster, put it here
                      scenario.get('initiative').splice(currentIndex, 0, elite)
                      return
                    } else if (otherMonster.version === 'elite' && otherMonster.standee > elite.standee) {
                      // In with elites of our type and the our standee is a lower number, put it here
                      scenario.get('initiative').splice(currentIndex, 0, elite)
                      return
                    } else if (otherMonster.version === 'normal') {
                      // Insert just before the normal monster
                      scenario.get('initiative').splice(currentIndex, 0, elite)
                      return
                    }
                  }
                }
              })

              sortedNormals.forEach(normal => {
                for (let currentIndex = scenario.get('initiative').indexOf(firstOfType);
                         currentIndex <= scenario.get('initiative').length;
                         currentIndex++) {
                  if (currentIndex === scenario.get('initiative').length) {
                    // Past all existing monsters, put it at the end
                    scenario.get('initiative').push(normal)
                    return
                  } else {
                    // Compare with the monster at the current index
                    const otherMonster = scenario.get('initiative')[currentIndex]
                    if (otherMonster.type !== type) {
                      // Reached the end of our type of monster, put it here
                      scenario.get('initiative').splice(currentIndex, 0, normal)
                      return
                    } else if (otherMonster.version === 'normal' && otherMonster.standee > normal.standee) {
                      // In with normals of our type and the our standee is a lower number, put it here
                      scenario.get('initiative').splice(currentIndex, 0, normal)
                      return
                    }
                  }
                }
              })
            } else {
              const firstWithHigherInitiative = scenario.get('initiative').find(entity => entity.initiative > previousMonsters.initiative)
              if (firstWithHigherInitiative) {
                const indexOfFirstWithHigherInitiative = scenario.get('initiative').indexOf(firstWithHigherInitiative)
                // Put them all just before the monster with higher initiative, normals then elites (due to splice behaviour)
                scenario.get('initiative').splice(indexOfFirstWithHigherInitiative, 0, ...sortedNormals)
                scenario.get('initiative').splice(indexOfFirstWithHigherInitiative, 0, ...sortedElites)
              } else {
                // Put them all at the end of the round, elites then normals (due to push behaviour)
                scenario.get('initiative').push(...sortedElites)
                scenario.get('initiative').push(...sortedNormals)
              }
            }
          }
        }
      } else {
        // Shuffle the monster deck
        const monsterDeck = monsters[type].deck.slice()
        for (let index = monsterDeck.length - 1; index > 0; index--) {
          let exchangeIndex = Math.floor(Math.random() * (index + 1));
          [monsterDeck[index], monsterDeck[exchangeIndex]] = [monsterDeck[exchangeIndex], monsterDeck[index]];
        }

        scenarioMonsters[type] = {
          deck: monsterDeck,
          monsterStats,
          currentCard: null,
          initiative: null,
          eliteActions: null,
          normalActions: null,
          elite: eliteStandees.map(standee => {
            return {
              type,
              version: 'elite',
              standee,
              hp: monsterStats.elite.hp,
              modifiedStats: null,
              conditions: []
            }
          }),
          normal: normalStandees.map(standee => {
            return {
              type,
              version: 'normal',
              standee,
              hp: monsterStats.normal.hp,
              modifiedStats: null,
              conditions: []
            }
          })
        }

        if (get(scenario, 'stage') === 'round') {
          // Draw a card for the monsters
          const currentCard = scenarioMonsters[type].deck.pop()
          const initiative = currentCard.initiative
          const eliteActions = action(monsterStats.elite, currentCard)
          const normalActions = action(monsterStats.normal, currentCard)

          // Set the appropriate actions
          const elites = A(scenarioMonsters[type].elite).sortBy('standee').map(monster => {
            set(monster, 'initiative', initiative)
            set(monster, 'actions', eliteActions)
            return monster
          })

          const normals = A(scenarioMonsters[type].normal).sortBy('standee').map(monster => {
            set(monster, 'initiative', initiative)
            set(monster, 'actions', normalActions)
            return monster
          })

          // Insert the monsters into the round order
          const revealingPlayerInitiative = scenario.get('initiative')[scenario.get('activeOrder')].initiative
          if (initiative < revealingPlayerInitiative) {
            const newMonsters = []
            newMonsters.push(...elites)
            newMonsters.push(...normals)
            scenario.get('initiative').splice(scenario.get('activeOrder') + 1, 0, ...newMonsters)
          } else {
            const firstWithHigherInitiative = scenario.get('initiative').find(entity => entity.initiative > initiative)
            if (firstWithHigherInitiative) {
              const indexOfFirstWithHigherInitiative = scenario.get('initiative').indexOf(firstWithHigherInitiative)
              // Put them all just before the monster with higher initiative, normals then elites (due to splice behaviour)
              scenario.get('initiative').splice(indexOfFirstWithHigherInitiative, 0, ...normals)
              scenario.get('initiative').splice(indexOfFirstWithHigherInitiative, 0, ...elites)
            } else {
              // Put them all at the end of the round, elites then normals (due to push behaviour)
              scenario.get('initiative').push(...elites)
              scenario.get('initiative').push(...normals)
            }
          }
        }
      }

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
      this.get('model.revealed').push(this.get('model.reveal'))
      this.set('model.reveal', null)
      await this.get('model').save()
      this.transitionToRoute(this.get('model.stage'))
    }
  }
});
