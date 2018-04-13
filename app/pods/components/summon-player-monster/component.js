import Component from '@ember/component'

export default Component.extend({
  monsterType: null,
  monsterHp: null,

  actions: {
    setMonsterType (monsterType) {
      this.set('monsterType', monsterType)
    },

    setMonsterHp (monsterHp) {
      this.set('monsterHp', monsterHp)
    }
  }
})
