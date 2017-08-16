import * as _ from './liteutils'
const INVALID_KEY_RX = /^\d|[^a-zA-Z0-9_]/gm

/**
 * returns true if object is non empty object
 * @param obj
 * @returns {boolean|*}
 */
export function isHash (obj) {
  return typeof obj === 'object' &&
    !Array.isArray(obj) &&
    !(obj instanceof Date) &&
    obj !== null
}

/**
 * joins 2 paths
 * @param base
 * @param path
 * @returns {string}
 */
export function pathJoin (base, path) {
  try {
    let connector = path.match(/^\[/) ? '' : '.'
    return `${base ? base : ''}${base ? connector : ''}${path}`
  } catch (error) {
    return ''
  }
}

/**
 * generates an array of paths to use when creating an abstracted object
 * @param obj
 * @param current
 * @param paths
 * @returns {Array|*}
 */
export function getPaths (obj, current = '', paths = []) {
  if (isHash(obj)) {
    _.forEach(obj, (val, key) => {
      let k = key.match(INVALID_KEY_RX) ? `["${key}"]` : `.${key}`
      let cur = `${current}${k}`.replace(/^\./, '')
      paths.push(cur)
      if (isHash(val) || Array.isArray(val)) getPaths(val, cur, paths)
    })
  } else if (Array.isArray(obj)) {
    _.forEach(obj, (val, idx) => {
      let cur = `${current}[${idx}]`
      paths.push(cur)
      if (isHash(val) || Array.isArray(val)) getPaths(val, cur, paths)
    })
  }
  return [ ...new Set(paths) ]
}
