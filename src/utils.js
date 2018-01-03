import * as _ from './liteutils'
const INVALID_KEY_RX = /^\d|[^a-zA-Z0-9_]/gm
const INT_KEY_RX = /^\d+$/
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
 * simple helper to push paths and determine if more
 * paths need to be constructed
 * @param {*} obj 
 * @param {*} current 
 * @param {*} paths 
 */
export function pushPaths (obj, current, paths) {
  paths.push(current)
  if (isHash(obj) || Array.isArray(obj)) {
    getPaths(obj, current, paths)
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
      if (key.match(INT_KEY_RX) !== null) { // is index
        pushPaths(val, `${current}.${key}`.replace(/^\./, ''), paths)
        pushPaths(val, `${current}[${key}]`.replace(/^\./, ''), paths)
        pushPaths(val, `${current}["${key}"]`.replace(/^\./, ''), paths)
      } else if (key.match(INVALID_KEY_RX) !== null) { // must quote
        pushPaths(val, `${current}["${key}"]`.replace(/^\./, ''), paths)
      } else {
        pushPaths(val, `${current}.${key}`.replace(/^\./, ''), paths)
      }
    })
  } else if (Array.isArray(obj)) {
    _.forEach(obj, (val, idx) => {
      pushPaths(val, `${current}.${idx}`.replace(/^\./, ''), paths)
      pushPaths(val, `${current}[${idx}]`.replace(/^\./, ''), paths)
      pushPaths(val, `${current}["${idx}"]`.replace(/^\./, ''), paths)
    })
  }
  return [ ...new Set(paths) ]
}
