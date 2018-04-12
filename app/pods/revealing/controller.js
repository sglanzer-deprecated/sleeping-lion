import Controller from '@ember/controller'
import { computed } from '@ember/object'

export default Controller.extend({

  countPerStandeeType: computed('model.revealing', function () {
    const revealing = this.get('model.revealing')
    const monsterModels = this.get('model.monsterModels')
    return Object.entries(monsterModels).reduce(({ elite, normal }, [,{ monsters }]) => {
      return {
        elite: elite + monsters.filter(({tileId, version}) => tileId === revealing && version === 'elite').length,
        normal: normal + monsters.filter(({tileId, version}) => tileId === revealing && version === 'normal').length
      }
    }, { elite: 0, normal: 0 })
  }),

  monsterStandees: computed('model.revealing', function () {
    const revealing = this.get('model.revealing')
    const monsterModels = this.get('model.monsterModels')
    return Object.entries(monsterModels).map(([type, { monsters }]) => {
      return {
        type,
        elite: monsters.filter(({tileId, version}) => tileId === revealing && version === 'elite'),
        normal: monsters.filter(({tileId, version}) => tileId === revealing && version === 'normal')
      }
    })
  }),

  monsterActions: computed('model.revealing', function () {
    const revealing = this.get('model.revealing')
    if (revealing === this.get('model.scenario.initialTile')) {
      return
    }

    const monsterModels = this.get('model.monsterModels')
    return Object.entries(monsterModels).map(([type, { monsters, initiative, actions }]) => {
      const elite = monsters.filter(({tileId, version}) => tileId === revealing && version === 'elite').length > 0
      const normal = monsters.filter(({tileId, version}) => tileId === revealing && version === 'normal').length > 0

      return {
        type,
        initiative,
        elite: elite ? actions.elite : [],
        normal: normal ? actions.normal : []
      }
    })
  }),

  actions: {
    async nextStage () {
      this.get('model.revealed').push(this.get('model.revealing'))
      this.set('model.revealing', null)
      await this.get('model').save()

      this.transitionToRoute(this.get('model.stage'))
    }
  }

})
