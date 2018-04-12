import Component from '@ember/component'
import { computed } from '@ember/object'
import { isNone } from '@ember/utils'

export default Component.extend({

  classNameBindings: [
    'isActive:active',
    'isTarget:target'
  ],

  monsterActions: computed(function() {
    const version = this.get('entity.version')
    if (version) {
      return this.get(`model.monsterModels.${this.get('entity.type')}.actions.${version}`)
    }
  }),

  isActive: computed('activeEntity', function () {
    const entity = this.get('entity')
    const activeEntity = this.get('activeEntity')
    if (isNone(activeEntity)) {
      return false
    }

    if (entity.version) {
      return entity.type === activeEntity.type
        && entity.standee === activeEntity.standee
    } else {
      return entity.type === activeEntity.type
    }
  }),

  isTarget: computed('targetEntity', function () {
    const entity = this.get('entity')
    const targetEntity = this.get('targetEntity')
    if (isNone(targetEntity)) {
      return false
    }

    if (entity.version) {
      return entity.type === targetEntity.type
        && entity.standee === targetEntity.standee
    } else {
      return entity.type === targetEntity.type
    }
  }),

  click () {
    this.onSelect()
  }

})
