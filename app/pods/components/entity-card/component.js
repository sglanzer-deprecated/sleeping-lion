import Component from '@ember/component'
import { computed } from '@ember/object'
import { isNone } from '@ember/utils'

export default Component.extend({

  classNameBindings: [
    'isActive:active',
    'isTarget:target'
  ],

  isActive: computed('activeEntity', function () {
    const entity = this.get('entity')
    const activeEntity = this.get('activeEntity')
    if (isNone(activeEntity)) {
      return false
    }

    if (entity.type
      && entity.type === activeEntity.type
      && entity.standee === activeEntity.standee) {
      return true
    }
    return entity.class && entity.class === activeEntity.class
  }),

  isTarget: computed('targetEntity', function () {
    const entity = this.get('entity')
    const targetEntity = this.get('targetEntity')
    if (isNone(targetEntity)) {
      return false
    }

    if (entity.type
      && entity.type === targetEntity.type
      && entity.standee === targetEntity.standee) {
      return true
    }
    return entity.class && entity.class === targetEntity.class
  }),

  click () {
    this.onSelect()
  }

});
