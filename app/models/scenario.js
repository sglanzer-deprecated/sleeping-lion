import Model from 'ember-pouch/model'
import DS from 'ember-data'

const {
  attr
} = DS

export default Model.extend({
  // Initialization properties
  stage: attr('string'),

  // Scenario
  scenario: attr(),
  monsterLevel: attr('number'),
  trapDamage: attr('number'),
  goldPerToken: attr('number'),
  bonusXp: attr('number'),

  // "Travel" (initiate the scenario)

  // Global scenario management properties
  initialPlayerCount: attr('number'),
  round: attr('number'),
  infusions: attr(),

  // Tile reveal
  revealing: attr('string'),
  revealed: attr(),

  // Entity management
  players: attr(),
  monsterModels: attr(),
  monsterAttackModifierDeck: attr(),
  monsterCurses: attr('number'),

  // Round management
  playerInitiativeLocked: attr('boolean'),
  roundOrder: attr(),
  activeRoundOrder: attr('number'),
  targetEntity: attr()
})
