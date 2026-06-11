import who from './who.json' with { type: 'json' };

export default function () {
  return `Hello, ${who[Math.floor(Math.random() * who.length)]}`;
}
