import Component from '@ember/component'
import { computed } from '@ember/object'
import { types, levels } from 'sleeping-lion/dictionary/player'

export default Component.extend({
  types,
  levels,

  player: computed('model.players.[]', 'model.players.@each.hp', function () {
    return this.get('model.players').find(player => {
      return player.index === this.get('index')
    })
  }),

  actions: {
    setType (type) {
      const level = 1 // Default to level 1
      this.onChange(this.get('index'), type, level)
    },

    setLevel (level) {
      this.onChange(this.get('index'), this.get('player.type'), level)
    }
  }
})
