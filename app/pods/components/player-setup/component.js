import Component from '@ember/component';
import { computed } from '@ember/object'

export default Component.extend({
  playerClasses: ['None', 'Mindthief', 'Tinkerer', 'Scoundrel', 'Brute', 'Cragheart', 'Spellweaver'],
  playerLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9],

  player: computed(function () {
    return {}
  }),

  actions: {
    setPlayerClass (playerClass) {
      this.set('player.class', playerClass)
      this.set('player.level', 1)
      this.onChange(this.get('player'))
    },

    setPlayerLevel (playerLevel) {
      this.set('player.level', playerLevel)
      this.onChange(this.get('player'))
    }
  }
});
