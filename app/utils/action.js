import { typeOf } from '@ember/utils'
import { isNone } from '@ember/utils'

export default function action(base, card) {
  return card.actions.map(action => {
    return Object.entries(action).reduce((result, [key, value]) => {
      if (isNone(value)) {
        return key
      }

      if (typeOf(value) === 'string') {
        return `${key}: ${value}`
      }

      return `${key}: ${(base[key] || 0) + value}`
    }, '')
  })
}
