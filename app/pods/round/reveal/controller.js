import Controller from '@ember/controller'
import { inject } from '@ember/service'

export default Controller.extend({

  scenario: inject(),

  actions: {
    async reveal (tile) {
      this.get('scenario').reveal(tile)
    }
  }

})
