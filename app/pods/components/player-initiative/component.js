import Component from '@ember/component'
import { computed } from '@ember/object'

export default Component.extend({
  isLongRest: computed('player.initiative', function () {
    return this.get('player.initiative') === 99.5
  }),

  actions: {
    setInitiative (initiative) {
      this.onChange(Math.max(0, Math.min(Number(initiative).toFixed(0), 99)))
    },

    setLongRest (isLongRest) {
      this.onChange(isLongRest ? 99.5 : null)
    }
  }
});
