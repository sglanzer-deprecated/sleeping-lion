import Controller from '@ember/controller';
import { get, set } from '@ember/object'
import { A } from '@ember/array'
import monsters from 'sleeping-lion/dictionary/monsters'

export default Controller.extend({

  infusions: ['fire', 'ice', 'air', 'earth', 'light', 'dark'], // TODO: Util
  undoRedoStack: [],

  actions: {
    async advanceOrder () {
      this.set('model.activeOrder', this.get('model.activeOrder') + 1)
      await this.get('model').save()

      this.set('targetEntity', null)

      // TODO: Clear any conditions that were present on entry and weren't renewed during the entity turn
      // const priorEntity = initiative.shiftObject()
      // set(priorEntity, 'conditions', clearedConditions)

      // TODO: Long rest (heal, prompt for redraw / exhaust)

      if (this.get('model.initiative.length') - 1 < this.get('model.activeOrder')) {

        // Shuffle the monster decks if necessary
        Object.entries(this.get('model.monsters')).forEach(([type, monsterModel]) => {
          if (monsterModel.currentCard.shuffle === 1) {
            const monsterDeck = monsters[type].deck.slice()
            for (let index = monsterDeck.length - 1; index > 0; index--) {
              let exchangeIndex = Math.floor(Math.random() * (index + 1));
              [monsterDeck[index], monsterDeck[exchangeIndex]] = [monsterDeck[exchangeIndex], monsterDeck[index]];
            }

            set(monsterModel, 'deck', monsterDeck)
          }

          set(monsterModel, 'currentCard', null)
          set(monsterModel, 'initiative', null)
          set(monsterModel, 'eliteActions', null)
          set(monsterModel, 'normalActions', null)
        })

        // Reduce infusions
        this.get('infusions').forEach(infusion => {
          const reducedInfusion = (this.get(`model.infusions.${infusion}`) || 0) - 1
          this.set(`model.infusions.${infusion}`, reducedInfusion <= 0 ? 0 : reducedInfusion)
        })

        this.set('model.round', this.get('model.round') + 1)
        this.get('model.players').forEach(player => {
          set(player, 'initiative', null)
        })
        Object.entries(this.get('model.monsters')).forEach(([, monsterModel]) => {
          set(monsterModel, 'initiative', null)
          set(monsterModel, 'eliteActions', null)
          set(monsterModel, 'normalActions', null)
        })
        this.set('model.initiative', [])
        this.set('model.stage', 'round-setup')
        this.set('model.activeOrder', 0)
        await this.get('model').save()
        this.transitionToRoute('round-setup')
      }
    },

    targetEntity (entity) {
      this.set('targetEntity', entity)
    },

    async infuse (infusion) {
      this.set(`model.infusions.${infusion}`, 2)
      await this.get('model').save()
    },

    async consume (infusion) {
      this.set(`model.infusions.${infusion}`, 0)
      await this.get('model').save()
    },

    async damage (entity, hp) {
      if (entity.hp - hp <= 0) {
        const dead = window.confirm('Not a damage mis-click? Really truly dead?')
        if (dead) {
          if (entity.class) {
            const players = A(this.get('model.players'))
            const player = players.findBy('class', entity.class)
            players.removeObject(player)

            const initiatives = A(this.get('model.initiative'))
            const initiative = initiatives.findBy('class', entity.class)
            initiatives.removeObject(initiative)
          } else {
            const elites = A(this.get(`model.monsters.${entity.type}.elite`))
            const elite = elites.findBy('standee', entity.standee)
            if (elite) {
              elites.removeObject(elite)
            } else {
              const normals = A(this.get(`model.monsters.${entity.type}.normal`))
              const normal = normals.findBy('standee', entity.standee)
              if (normal) {
                normals.removeObject(normal)
              }
            }

            const initiatives = A(this.get('model.initiative'))
            const initiative = initiatives.find(monster => monster.type && monster.type === entity.type && monster.standee === entity.standee)
            initiatives.removeObject(initiative)
          }
        } else {
          return
        }
      }

      set(entity, 'hp', entity.hp - hp)
      await this.get('model').save()
    },

    async heal (entity, hp) {
      set(entity, 'hp', entity.hp + hp)
      await this.get('model').save()
    },

    async toggleCondition (entity, condition) {
      const currentConditions = get(entity, 'conditions').slice()
      const conditionIndex = currentConditions.indexOf(condition)

      if (conditionIndex >= 0) {
        currentConditions.splice(conditionIndex, 1)
      } else {
        currentConditions.push(condition)
      }

      set(entity, 'conditions', currentConditions)

      await this.get('model').save()
    },

    reveal () {
      this.transitionToRoute('round.reveal')
    }
  }

});
