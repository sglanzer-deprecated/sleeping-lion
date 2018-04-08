export default {
  deck: [
    { shuffle: 0, initiative: 16, actions: [ { mv: 1 }, { atk: -1 }, { rng: 0 } ] },
    { shuffle: 0, initiative: 31, actions: [ { mv: 0 }, { atk: 0 }, { rng: 0 } ] },
    { shuffle: 0, initiative: 32, actions: [ { mv: 0 }, { atk: 1 }, { rng: -1 } ] },
    { shuffle: 0, initiative: 44, actions: [ { mv: -1 }, { atk: 1 }, { rng: 0 } ] },
    { shuffle: 0, initiative: 56, actions: [ { atk: -1 }, { rng: 0 }, { target: 2 } ] },
    { shuffle: 1, initiative: 68, actions: [ { atk: 1 }, { rng: 1 } ] },
    { shuffle: 0, initiative: 14, actions: [ { mv: -1} , { atk: -1 }, { rng: 0 }, { action: 'Create a 3 damage trap in an adjacent empty hex closest to an enemy' } ] },
    { shuffle: 1, initiative: 29, actions: [ { mv: 0 }, { atk: -1 }, { rng: 1 }, { immobilize: 1 } ] }
  ],
  standees: 6,
  level: {
    0: {
      normal: { hp: 4, mv: 2, atk: 2, rng: 3, attrs: {} },
      elite: { hp: 6, mv: 2, atk: 3, rng: 3, attrs: {} }
    },
    1: {
      normal: { hp: 5, mv: 2, atk: 2, rng: 4, attrs: {} },
      elite: { hp: 7, mv: 2, atk: 3, rng: 5, attrs: {} }
    },
    2: {
      normal: { hp: 6, mv: 3, atk: 2, rng: 4, attrs: {} },
      elite: { hp: 9, mv: 3, atk: 3, rng: 5, attrs: {} }
    },
    3: {
      normal: { hp: 6, mv: 3, atk: 3, rng: 4, attrs: {} },
      elite: { hp: 10, mv: 3, atk: 4, rng: 5, attrs: {} }
    },
    4: {
      normal: { hp: 8, mv: 3, atk: 3, rng: 4, attrs: {} },
      elite: { hp: 10, mv: 3, atk: 4, rng: 6, attrs: { poison: 1 } }
    },
    5: {
      normal: { hp: 10, mv: 3, atk: 3, rng: 5, attrs: {} },
      elite: { hp: 12, mv: 4, atk: 4, rng: 6, attrs: { poison: 1 } }
    },
    6: {
      normal: { hp: 10, mv: 3, atk: 4, rng: 5, attrs: {} },
      elite: { hp: 13, mv: 4, atk: 5, rng: 6, attrs: { poison: 1 } }
    },
    7: {
      normal: { hp: 13, mv: 3, atk: 4, rng: 5, attrs: {} },
      elite: { hp: 17, mv: 4, atk: 5, rng: 6, attrs: { poison: 1 } }
    }
  }
}
