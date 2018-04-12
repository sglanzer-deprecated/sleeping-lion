import levels from 'sleeping-lion/dictionary/levels'

const recommendedLevel = function (players) {
  const playerLevelAverage = players.reduce((sum, {level}) => {
    return sum + level
  }, 0) / players.length

  return Math.ceil(playerLevelAverage / 2)
}

const trapDamage = function (monsterLevel) {
  return levels[monsterLevel].trap
}

const goldPerToken = function (monsterLevel) {
  return levels[monsterLevel].gold
}

const bonusXp = function (monsterLevel) {
  return levels[monsterLevel].xp
}

export {
  recommendedLevel,
  trapDamage,
  goldPerToken,
  bonusXp
}
