import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    async reveal (tile) {
      this.set('model.reveal', tile)
      await this.get('model').save()
      this.transitionToRoute('reveal')
    }
  }

});
