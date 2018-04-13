import Component from '@ember/component'
import monsters from 'sleeping-lion/dictionary/monsters'
import { computed } from '@ember/object'

export default Component.extend({
  monsterType: null,

  monsterTypes: computed('monsters', function () {
    return Object.keys(monsters)
  }),

  actions: {
    setMonsterType (monsterType) {
      this.set('monsterType', monsterType)
    }
  }
})
