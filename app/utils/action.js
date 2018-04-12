import { isNone, typeOf } from '@ember/utils'

export default function action(base, card) {
  const actions = card.actions.map(action => {
    return Object.entries(action).reduce((result, [key, value]) => {
      if (isNone(value)) {
        return {
          key
        }
      }

      if (typeOf(value) === 'string') {
        return {
          key,
          value
        }
      }

      // Look for the base value in the root of the base
      let baseValue = base[key]
      if (!baseValue && base.attrs) {
        // Look for the base value in the attrs of the base
        baseValue = base.attrs[key]
      }

      return {
        key,
        value: `${(baseValue || 0) + value}`
      }
    }, {})
  })

  // If any attrs of the base aren't present in the actions, add them at the end
  if (base.attrs) {
    Object.entries(base.attrs).forEach(([attrKey, attrValue]) => {
      if (!actions.find(({key}) => key === attrKey)) {
        actions.push({
          key: attrKey,
          value: attrValue
        })
      }
    })
  }

  return actions
}
