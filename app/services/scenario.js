import { A } from '@ember/array'
import { get, set, setProperties } from '@ember/object'
import Service, { inject } from '@ember/service'
import { isNone } from '@ember/utils'
import { types as infusionTypes } from 'sleeping-lion/dictionary/infusions'
import { default as monsterDictionary, attackModifierDeck } from 'sleeping-lion/dictionary/monsters'
import { getHp } from 'sleeping-lion/dictionary/player'
import action from 'sleeping-lion/utils/action'
import { recommendedLevel, trapDamage, goldPerToken, bonusXp } from 'sleeping-lion/utils/monster-level'
import { sort } from 'sleeping-lion/utils/round-order'
import shuffle from 'sleeping-lion/utils/shuffle'

export default Service.extend({

  router: inject(),

  setModel (model) {
    this.set('model', model)
  },

  async setPlayer (index, type, level) {
    const model = this.get('model')
    const players = get(model, 'players')
    const existingPlayer = players.find(player => player.index === index)

    if (existingPlayer) {
      setProperties(existingPlayer, {
        type,
        level,
        maxHp: getHp(type, level),
        hp: getHp(type, level)
      })
    } else {
      players.pushObject({
        index,
        type,
        level,
        maxHp: getHp(type, level),
        hp: getHp(type, level),
        conditions: []
      })
    }

    const monsterLevel = recommendedLevel(players)
    setProperties(model, {
      monsterLevel,
      trapDamage: trapDamage(monsterLevel),
      goldPerToken: goldPerToken(monsterLevel),
      bonusXp: bonusXp(monsterLevel)
    })

    await model.save()
  },

  async setScenario (scenario) {
    const model = this.get('model')

    set(model, 'scenario', scenario)

    await model.save()
  },

  async adjustMonsterLevel (adjustment) {
    const model = this.get('model')

    const adjustedMonsterLevel = Math.max(Math.min(get(model, 'monsterLevel') + adjustment, 7), 0)
    setProperties(model, {
      monsterLevel: adjustedMonsterLevel,
      trapDamage: trapDamage(adjustedMonsterLevel),
      goldPerToken: goldPerToken(adjustedMonsterLevel),
      bonusXp: bonusXp(adjustedMonsterLevel)
    })

    await model.save()
  },

  async travel () {
    const model = this.get('model')

    setProperties(model, {
      stage: 'round-setup',

      initialPlayerCount: get(model, 'players.length'),
      round: 1,
      infusions: infusionTypes.reduce((infusions, infusionType) => {
        infusions[infusionType] = 0
        return infusions
      }, {}),


      revealed: [],

      monsterModels: {},
      monsterAttackModifierDeck: attackModifierDeck,
      monsterCurses: 0
    })

    await this.get('model').save()
  },

  getRemainingStandees (monsterType) {
    const standees = get(monsterDictionary, `${monsterType}.standees`)
    const remainingStandees = Array.from(Array(standees)).map((entity, index) => index + 1)

    const monsterModel = this.get(`model.monsterModels.${monsterType}`)
    if (isNone(monsterModel)) {
      return remainingStandees
    }

    const activeStandees = get(monsterModel, 'monsters').map(({standee}) => standee)
    return remainingStandees.filter(standee => !activeStandees.includes(standee))
  },

  async reveal (tileId, playerInitiative) {
    const model = this.get('model')

    set(model, 'revealing', tileId)
    get(model, 'revealed').pushObject(tileId)

    const tile = get(model, `scenario.tiles.${tileId}`)
    const initialPlayerCount = this.get('model.initialPlayerCount')
    const monsterTokens = get(tile, `monsterTokens.${initialPlayerCount}`)

    const monsterLevel = get(model, 'monsterLevel')
    monsterTokens.forEach(({type, counts}) => {
      const monsters = []
      const stats = monsterDictionary[type].level[monsterLevel]
      const standees = shuffle(this.getRemainingStandees(type))

      ;['elite', 'normal'].forEach(version => {
        for (let number = 0; number < get(counts, version); number++) {
          monsters.push({
            tileId,
            type,
            version,
            standee: standees.pop(),
            maxHp: get(stats, `${version}.hp`),
            hp: get(stats, `${version}.hp`),
            conditions: []
          })
        }
      })

      const monsterModel = get(model, `monsterModels.${type}`)
      if (monsterModel) {
        // More monsters for an existing type
        get(monsterModel, 'monsters').push(...monsters.map(monster => {
          set(monster, 'initiative', get(monsterModel, 'initiative'))
          return monster
        }))
      } else if (tileId !== get(model, 'scenario.initialTile')) {
        // New monster type during a round - immediately draw a monster card
        const deck = shuffle(monsterDictionary[type].deck.slice())
        const card = deck.pop()
        const initiative = get(card, 'initiative')
        const adjustedInitiative = playerInitiative ? (playerInitiative < initiative ? initiative : playerInitiative + 0.5) : initiative
        set(model, `monsterModels.${type}`, {
          stats,
          monsters: monsters.map(monster => {
            set(monster, 'initiative', adjustedInitiative)
            return monster
          }),
          deck,
          card,
          initiative: adjustedInitiative,
          actions: {
            elite: action(stats.elite, card),
            normal: action(stats.normal, card)
          }
        })
      } else {
        // Initial monsters
        set(model, `monsterModels.${type}`, {
          stats,
          monsters,
          deck: shuffle(monsterDictionary[type].deck.slice())
        })
      }

      if (tileId !== get(model, 'scenario.initialTile')) {
        // Add the monsters the round order and re-sort
        const roundOrder = get(model, 'roundOrder')
        roundOrder.push(...monsters)
        sort(roundOrder)
      }
    })

    await this.get('model').save()

    this.get('router').transitionTo('revealing')
  },

  async setPlayerInitiative (player, initiative) {
    set(player, 'initiative', initiative)
    await this.get('model').save()
  },

  async drawMonsterCards () {
    this.set('model.playerInitiativeLocked', true)

    const monsterModels = this.get('model.monsterModels')

    Object.entries(monsterModels).forEach(([type, monsterModel]) => {
      // Shuffle the monster deck if necessary and draw a card
      if (get(monsterModel, 'card.shuffle') === 1) {
        set(monsterModel, 'deck', shuffle(monsterDictionary[type].deck.slice()))
      }
      const card = get(monsterModel, 'deck').pop()

      const stats = get(monsterModel, 'stats')
      setProperties(monsterModel, {
        card,
        initiative: card.initiative,
        actions: {
          elite: action(stats.elite, card),
          normal: action(stats.normal, card)
        }
      })
    })

    await this.get('model').save()
  },

  async fight () {
    const model = this.get('model')
    const players = get(model, 'players')

    const monsters = Object.entries(get(model, 'monsterModels')).reduce((monsters, [, monsterModel]) => {
      const typeMonsters = get(monsterModel, 'monsters').map(monster => {
        set(monster, 'initiative', get(monsterModel, 'initiative'))
        return monster
      })
      monsters.push(...typeMonsters)
      return monsters
    }, [])

    const roundOrder = []
    roundOrder.push(...players)
    roundOrder.push(...monsters)
    sort(roundOrder)

    setProperties(model, {
      stage: 'round',
      roundOrder,
      activeRoundOrder: 0,
      targetEntity: null
    })

    await model.save()

    this.get('router').transitionTo('round')
  },

  async infuse (infusion) {
    this.set(`model.infusions.${infusion}`, 2)
    await this.get('model').save()
  },

  async consume (infusion) {
    this.set(`model.infusions.${infusion}`, 0)
    await this.get('model').save()
  },

  async target (entity) {
    this.set('model.targetEntity', entity)
    await this.get('model').save()
  },

  async damage (entity, hp) {
    if (entity.hp - hp > 0) {
      set(entity, 'hp', entity.hp - hp)
    } else {
      // Dead/exhausted
      if (entity.version) {
        const monsters = A(this.get(`model.monsterModels.${entity.type}.monsters`))
        const monster = monsters.findBy('standee', entity.standee)
        monsters.removeObject(monster)

        const roundOrder = this.get('model.roundOrder').slice()
        const roundEntity = roundOrder.find(({ type, standee }) => type === entity.type && standee === entity.standee)
        const roundIndex = roundOrder.indexOf(roundEntity)
        roundOrder.splice(roundIndex, 1)
        this.set('model.roundOrder', roundOrder)
      } else {
        const players = A(this.get('model.players'))
        const player = players.findBy('type', entity.type)
        players.removeObject(player)

        const roundOrder = this.get('model.roundOrder').slice()
        const roundEntity = roundOrder.find(({ type }) => type === entity.type)
        const roundIndex = roundOrder.indexOf(roundEntity)
        roundOrder.splice(roundIndex, 1)
        this.set('model.roundOrder', roundOrder)
      }
    }
    await this.get('model').save()
  },

  async heal (entity, hp) {
    set(entity, 'hp', Math.min(entity.hp + hp, entity.maxHp))
    await this.get('model').save()
  },

  async toggleCondition (entity, condition) {
    const currentConditions = get(entity, 'conditions').slice()
    const conditionIndex = currentConditions.indexOf(condition)

    // Remove the condition if already present, add it otherwise
    if (conditionIndex >= 0) {
      currentConditions.splice(conditionIndex, 1)
    } else {
      currentConditions.push(condition)
    }

    set(entity, 'conditions', currentConditions)

    await this.get('model').save()
  },

  async advanceRoundOrder () {
    const model = this.get('model')

    const nextRoundOrder = get(model, 'activeRoundOrder') + 1
    if (nextRoundOrder < get(model, 'roundOrder').length) {
      setProperties(model, {
        activeRoundOrder: nextRoundOrder,
        targetEntity: null
      })

      await this.get('model').save()
    } else {
      // The round is finished - reduce infusions
      infusionTypes.forEach(infusionType => {
        set(model, `infusions.${infusionType}`, Math.max(get(model, `infusions.${infusionType}`) - 1, 0))
      })

      // Reset player initiatives
      get(model, 'players').forEach(player => {
        set(player, 'initiative', null)
      })

      // Transition the stage
      setProperties(model, {
        stage: 'round-setup',
        round: get(model, 'round') + 1,
        playerInitiativeLocked: false
      })

      await this.get('model').save()

      this.get('router').transitionTo('round-setup')
    }
  }

})
