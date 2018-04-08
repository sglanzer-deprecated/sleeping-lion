import { computed } from '@ember/object'
import Service, { inject } from '@ember/service'
import { isNone } from '@ember/utils'

export default Service.extend({

  store: inject(),

  model: computed(async function () {
    const scenarios = await this.get('store').findAll('scenario')
    let scenario = scenarios.get('firstObject')

    if (isNone(scenario)) {
      scenario = this.store.createRecord('scenario', {
        stage: 'scenario-setup'
      })
      await scenario.save()
    }

    return scenario
  })

})
