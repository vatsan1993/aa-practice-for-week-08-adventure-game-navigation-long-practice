module.exports = {
  rooms: [
    {
      id: 1,
      name: 'Crossroad',
      description:
        'You are standing at a crossroad. To the north, east, south and west you see empty space, waiting to be filled.',
      exits: { n: 2, e: 3, w: 4, s: 5 },
    },
    {
      id: 2,
      name: 'Northern point',
      description:
        'You are standing at the north point of a crossroad. To the south, you see an empty intersection.',
      exits: { s: 1 },
    },
    {
      id: 3,
      name: 'Eastern point',
      description:
        'You are standing at the east point of a crossroad. To the west, you see an empty intersection.',
      exits: { w: 1 },
    },
    {
      id: 4,
      name: 'Western point',
      description:
        'You are standing at the west point of a crossroad. To the east, you see an empty intersection.',
      exits: { e: 1, s: 6 },
    },
    {
      id: 5,
      name: 'Southern point',
      description:
        'You are standing at the south point of a crossroad. To the north nad west you have rooms..',
      exits: { n: 1, w: 6 },
    },
    {
      id: 6,
      name: 'South west point',
      description:
        'You are standing at the south west point of a crossroad. you have rooms towards east, north, south',
      exits: { n: 1, e: 5, s: 7 },
    },
    {
      id: 7,
      name: 'South most point',
      description:
        'You are standing at the south most point. You have a rooms towards north, east, west',
      exits: { n: 6, e: 8 },
    },
    {
      id: 8,
      name: 'West corner room',
      description:
        'You are standing at the West corner room. You have a rooms towards north, east, west',
      exits: { w: 7, n: 5 },
    },
  ],
  items: [
    {
      name: 'rock',
      description: 'Just a simple rock',
      room: 1,
    },
    {
      name: 'sandwich',
      description: 'A tasty looking sandwich',
      room: 2,
      isFood: true,
    },
    {
      name: 'Apple',
      description: 'A healthy apple',
      room: 5,
      isFood: true,
    },
    {
      name: 'Common sword',
      description: 'A low power sword',
      room: 5,
      isFood: false,
    },
    {
      name: 'Legendary sword',
      description: 'A low power sword',
      room: 8,
      isFood: false,
    },
    {
      name: 'Armour',
      description: 'An armour for defense',
      room: 2,
      isFood: false,
    },
    {
      name: 'Steel',
      description: 'Steel',
      room: 1,
      isFood: false,
    },
  ],
};
