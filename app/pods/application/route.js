import Route from '@ember/routing/route';
import { isNone } from '@ember/utils'

export default Route.extend({
  async model () {
    const scenarios = await this.store.findAll('scenario')
    let scenario = scenarios.get('firstObject')

    if (isNone(scenario)) {
      scenario = this.store.createRecord('scenario', {
        number: null,
        round: null,
        stage: 'scenario-setup',
        infusions: [],
        revealedTiles: [],
        revealingTile: null,
        players: [],
        monsters: [],
        baseMonsterAttackModifierDeck: [],
        roundQueue: []
      })
      scenario.save()
    }

    return scenario
  },

  afterModel (model) {
    if (isNone(model.get('reveal'))) {
      this.transitionTo(model.get('stage'))
    } else {
      this.transitionTo('reveal')
    }
  }
});
