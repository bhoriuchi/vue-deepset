/* eslint-disable */
import isArray from './dash.isArray'

function forEach (obj, fn) {
  try {
    if (isArray(obj)) {
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

forEach._accepts = [Object, Array]

export default forEach
