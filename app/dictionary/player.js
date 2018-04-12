const players = [
  { type: 'Brute',       hp: [10, 12, 14, 16, 18, 20, 22, 24, 26] },
  { type: 'Cragheart',   hp: [10, 12, 14, 16, 18, 20, 22, 24, 26] },
  { type: 'Mindthief',   hp: [6, 7, 8, 9, 10, 11, 12, 13, 14] },
  { type: 'Scoundrel',   hp: [8, 9, 11, 12, 14, 15, 17, 18, 20] },
  { type: 'Spellweaver', hp: [6, 7, 8, 9, 10, 11, 12, 13, 14] },
  { type: 'Tinkerer',    hp: [8, 9, 11, 12, 14, 15, 17, 18, 20] }
]

const types = players.map(({type}) => type)
const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const getHp = function (type, level) {
  return players.find(player => player.type === type).hp[level - 1]
}

export {
  players,
  types,
  levels,
  getHp
}
