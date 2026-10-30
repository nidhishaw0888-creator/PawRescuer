const map = { true: true, false: false }
const falsy = [null, undefined, false, 0, -0, 0n, '']

export function clsx(...parts) {
  return parts
    .flat(Infinity)
    .filter((part) => typeof part === 'string' && part.length > 0)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export { map, falsy }
