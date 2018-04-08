import Model from 'ember-pouch/model'
import DS from 'ember-data'

const {
  attr
} = DS

export default Model.extend({
  number: attr('number'),
  round: attr('number'),
  stage: attr('string'),
  infusions: attr(),
  reveal: attr('string'),
  revealed: attr(),
  players: attr(),
  playerCount: attr('number'),
  monsterLevel: attr('number'),
  monsters: attr(),
  baseMonsterAttackModifierDeck: attr(),
  initiative: attr(),
  activeOrder: attr('number')
})
