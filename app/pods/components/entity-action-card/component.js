import Component from '@ember/component'
import { computed } from '@ember/object'

export default Component.extend({
  conditions: [ // TODO: Util
    { id: 'DISARM', shorthand: 'DIS' },
    { id: 'IMMOBILIZE', shorthand: 'IMM' },
    { id: 'WOUND', shorthand: 'WOU' },
    { id: 'INVISIBILITY', shorthand: 'INV' },
    { id: 'MUDDLE', shorthand: 'MUD' },
    { id: 'STUN', shorthand: 'STN' },
    { id: 'POISON', shorthand: 'POI' },
    { id: 'STRENGTHEN', shorthand: 'STR' }
  ],

  hpValues: computed(function () {
    const hpValues = [...Array(21).keys()]
    return hpValues.slice(1)
  })
})
