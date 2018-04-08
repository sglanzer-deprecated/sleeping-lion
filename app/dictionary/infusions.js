const dictionary = [
  { type: 'fire',  shorthand: 'Fire',  url: '' },
  { type: 'ice',   shorthand: 'Ice',   url: '' },
  { type: 'air',   shorthand: 'Air',   url: '' },
  { type: 'earth', shorthand: 'Earth', url: '' },
  { type: 'light', shorthand: 'Light', url: '' },
  { type: 'dark',  shorthand: 'Dark',  url: '' }
]

const types = dictionary.map(({type}) => type)

export {
  dictionary,
  types
}
