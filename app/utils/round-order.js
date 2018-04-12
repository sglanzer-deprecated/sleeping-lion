const sort = function (roundOrder) {
  roundOrder.sort((entityA, entityB) => {
    if (entityA.initiative < entityB.initiative) { return -1 }
    if (entityA.initiative > entityB.initiative) { return 1 }

    if (!entityA.version && entityB.version) { return -1 }
    if (entityA.version && !entityB.version) { return 1 }

    if (entityA.version === 'elite' && entityB.version === 'normal') { return -1 }
    if (entityA.version === 'normal' && entityB.version === 'elite') { return 1 }

    if (entityA.standee && entityB.standee) {
      if (entityA.standee < entityB.standee) { return -1 }
      if (entityA.standee > entityB.standee) { return 1 }
    }

    return 0
  })
}

export {
  sort
}
