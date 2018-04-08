import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils'
import { computed } from '@ember/object'
import scenarios from 'sleeping-lion/dictionary/scenarios'
import levels from 'sleeping-lion/dictionary/levels'

export default Controller.extend({

  players: {},
  scenarios,

  stage: computed('model.players.[]', function () {
    const players = this.get('model.players')
    if (isEmpty(players) || players.length < 2) {
      return 'players'
    }
    return 'scenario'
  }),

  monsterLevel: computed('model.players.[]', function () {
    const players = this.get('model.players')
    if (isEmpty(players)) {
      return
    }

    const playerLevelAverage = players.reduce((sum, {level}) => {
      return sum + level
    }, 0) / players.length

    return Math.ceil(playerLevelAverage / 2)
  }),

  trap: computed('monsterLevel', function () {
    const monsterLevel = this.get('monsterLevel')
    const level = levels[monsterLevel]
    return level.trap
  }),

  gold: computed('monsterLevel', function () {
    const monsterLevel = this.get('monsterLevel')
    const level = levels[monsterLevel]
    return level.gold
  }),

  xp: computed('monsterLevel', function () {
    const monsterLevel = this.get('monsterLevel')
    const level = levels[monsterLevel]
    return level.xp
  }),

  actions: {
    setPlayer (number, player) {
      this.set(`players.${number}`, player)
    },

    savePlayers () {
      const players = Object.entries(this.get('players')).map(([,player]) => {
        return {
          class: player.class,
          level: player.level,
          hp: 10, // TODO: Lookup class/level -> hp
          xp: 0,
          conditions: []
        }
      })
      this.set('model.players', players)
      this.get('model').save()
    },

    setScenario (number) {
      this.set('scenario', number)
    },

    decreaseMonsterLevel () {
      const decreasedMonsterLevel = this.get('monsterLevel') - 1
      this.set('monsterLevel', decreasedMonsterLevel >= 0 ? decreasedMonsterLevel : 0)
    },

    increaseMonsterLevel () {
      const increasedMonsterLevel = this.get('monsterLevel') + 1
      this.set('monsterLevel', increasedMonsterLevel <= 7 ? increasedMonsterLevel : 7)
    },

    async saveScenario () {
      this.set('model.number', this.get('scenario.number'))
      this.set('model.playerCount', this.get('model.players.length'))
      this.set('model.monsterLevel', this.get('monsterLevel'))
      this.set('model.monsters', {})
      this.set('model.stage', 'round-setup')
      this.set('model.round', 1)
      this.set('model.initiative', [])
      this.set('model.reveal', this.get('scenario.startingTile'))
      this.set('model.revealed', [])
      this.set('model.infusions', {
        fire: 0,
        ice: 0,
        air: 0,
        earth: 0,
        light: 0,
        dark: 0
      })
      await this.get('model').save()
      this.transitionToRoute('reveal')
    }
  }

});
