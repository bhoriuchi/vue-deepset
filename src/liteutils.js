/**
 * Converts a path string into a path array
 * @param pathString
 * @returns {Array}
 */
export function toPath (pathString) {
  if (Array.isArray(pathString)) return pathString
  if (typeof pathString === 'number') return [ pathString ]
  pathString = String(pathString)

  // taken from lodash - https://github.com/lodash/lodash
  let pathRx = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g
  let pathArray = []

  pathString.replace(pathRx, (match, number, quote, string) => {
    pathArray.push(
      quote
        ? string
        : (number !== undefined)
          ? Number(number)
          : match
    )
    return pathArray[pathArray.length - 1]
  })
  return pathArray
}

/**
 * loops through an object and executes the function
 * @param obj
 * @param fn
 */
export function forEach (obj, fn) {
  try {
    if (Array.isArray(obj)) {
      let idx = 0
      for (let val of obj) {
        if (fn(val, idx) === false) break
        idx++
      }
    } else {
      for (const key in obj) {
        if (fn(obj[key], key) === false) break
      }
    }
  } catch (err) {
    return
  }
}

/**
 * gets a value from a specific path - modified from lodash.js
 * @param obj
 * @param path
 * @param defaultValue
 * @returns {*}
 */
export function get (obj, path, defaultValue) {
  try {
    let o = obj
    const fields = Array.isArray(path)
      ? path
      : toPath(path)
    while (fields.length) {
      const prop = fields.shift()
      o = o[prop]
      if (!fields.length) {
        return o
      }
    }
  } catch (err) {
    return defaultValue
  }
  return defaultValue
}

/**
 * checks if a path exists - modified from lodash.js
 * @param object
 * @param path
 * @returns {boolean}
 */
export function hasPath(object, path) {
  path = toPath(path)

  let index = -1
  let { length } = path
  let result = false
  let key

  while (++index < length) {
    key = path[index]
    if (!(result = object != null && Object.prototype.hasOwnProperty.call(object, key))) {
      break
    }
    object = object[key]
  }

  return result
}
