import Controller from '@ember/controller';
import { getOwner } from '@ember/application'

export default Controller.extend({

  infusions: ['fire', 'ice', 'air', 'earth', 'light', 'dark'], // TODO: Util

  actions: {
    async reset () {
      await getOwner(this).lookup('adapter:application').db.destroy()
      window.location.reload()
    }
  }

});
