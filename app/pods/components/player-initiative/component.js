import Component from '@ember/component';

export default Component.extend({
  initiative: null,
  isLongRest: false,

  actions: {
    setInitiative (initiative) {
      if (initiative > 99) {
        this.set('initiative', 99)
      } else if (initiative < 0) {
        this.set('initiative', 0)
      } else {
        this.set('initiative', Number(Number(initiative).toFixed(0)))
      }
      this.onChange(this.get('initiative'), this.get('isLongRest'))
    },

    setLongRest (isLongRest) {
      if (isLongRest) {
        this.set('initiative', 99)
        this.set('isLongRest', true)
      } else {
        this.set('initiative', null)
        this.set('isLongRest', false)
      }
      this.onChange(this.get('initiative'), this.get('isLongRest'))
    }
  }
});
