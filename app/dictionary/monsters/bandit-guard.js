export default {
  deck: [
    { shuffle: 1, initiative: 15, actions: [ { shield: 1 }, { retaliate: 2 } ] },
    { shuffle: 0, initiative: 30, actions: [ { mv: 1 }, { atk: -1 } ] },
    { shuffle: 0, initiative: 35, actions: [ { mv: -1 }, { atk: 0 }, { rng: 2 } ] },
    { shuffle: 0, initiative: 50, actions: [ { mv: 0 }, { atk: 0 } ] },
    { shuffle: 0, initiative: 50, actions: [ { mv: 0 }, { atk: 0 } ] },
    { shuffle: 0, initiative: 70, actions: [ { mv: -1 }, { atk: 1 } ] },
    { shuffle: 0, initiative: 55, actions: [ { mv: -1} , { atk: 0 }, { strengthen: 'Self' } ] },
    { shuffle: 1, initiative: 15, actions: [ { shield: 1 }, { atk: 0 }, { poison: null } ] }
  ],
  standees: 6,
  level: {
    0: {
      normal: { hp: 5, mv: 2, atk: 2, rng: 0, attrs: [] },
      elite: { hp: 9, mv: 2, atk: 3, rng: 0, attrs: {} }
    },
    1: {
      normal: { hp: 6, mv: 3, atk: 2, rng: 0, attrs: [] },
      elite: { hp: 9, mv: 2, atk: 3, rng: 0, attrs: { shield: 1 } }
    },
    2: {
      normal: { hp: 6, mv: 3, atk: 3, rng: 0, attrs: [] },
      elite: { hp: 10, mv: 2, atk: 4, rng: 0, attrs: { shield: 1 } }
    },
    3: {
      normal: { hp: 9, mv: 3, atk: 3, rng: 0, attrs: [] },
      elite: { hp: 10, mv: 3, atk: 4, rng: 0, attrs: { shield: 2 } }
    },
    4: {
      normal: { hp: 10, mv: 4, atk: 3, rng: 0, attrs: [] },
      elite: { hp: 11, mv: 3, atk: 4, rng: 0, attrs: { muddle: 1, shield: 2 } }
    },
    5: {
      normal: { hp: 11, mv: 4, atk: 4, rng: 0, attrs: [] },
      elite: { hp: 12, mv: 3, atk: 5, rng: 0, attrs: { muddle: 1, shield: 2 } }
    },
    6: {
      normal: { hp: 14, mv: 4, atk: 4, rng: 0, attrs: [] },
      elite: { hp: 14, mv: 4, atk: 5, rng: 0, attrs: { muddle: 1, shield: 2 } }
    },
    7: {
      normal: { hp: 16, mv: 5, atk: 4, rng: 0, attrs: [] },
      elite: { hp: 14, mv: 3, atk: 5, rng: 0, attrs: { muddle: 1, shield: 3 } }
    }
  }
}
