export default [
  {
    number: 1,
    title: 'Black Barrow',
    location: 'G-10',
    requirements: 'None',
    links: 'Barrow Lair – #2',
    mapTokens: ['Treasure x1', 'Trap (damage) x2', 'Obstacle (1x2) x2'],
    introduction: [
      `
      The hill is easy enough to find—a short journey past the New Market Gate and you see it jutting out on the edge of the Corpsewood,
      looking like a rat under a rug. Moving closer you see the mound is formed from a black earth. Its small, overgrown entrance presents
      a worn set of stone stairs leading down into the darkness.
      `,
      `
      As you descend, you gratefully notice light emanating from below. Unfortunately, the light is accompanied by the unmistakable stench
      of death. You contemplate what kind of thieves would make their camp in such a horrid place as you reach the bottom of the steps.
      Here you find your answer—a rough group of cutthroats who don’t seem to have taken very kindly to your sudden appearance. One in the
      back matches the description of your quarry.
      `,
      `
      “Take care of these unfortunates,” he says, backing out of the room. You can vaguely make out his silhouette as he retreats down a
      hallway and through a door to his left.
      `,
      `
      “Well, it’s not every day we get people stupid enough to hand-deliver their valuables to us,” grins one of the larger bandits,
      unsheathing a rusty blade. “We’ll be killing you now.”
      `,
      `
      Joke’s on them. If you had any valuables, you probably wouldn’t be down here in the first place.
      `
    ],
    goal: 'Kill all enemies',
    startingTile: 'L1a',
    tiles: [
      {
        id: 'L1a',
        monsterTokens: {
          2: [
            { type: 'Bandit guard', elite: 1, normal: 2 }
          ],
          3: [
            { type: 'Bandit guard', elite: 0, normal: 6 }
          ],
          4: [
            { type: 'Bandit guard', elite: 2, normal: 4 }
          ]
        }
      }
    ]
  }
]
