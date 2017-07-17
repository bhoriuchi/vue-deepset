/* eslint-disable */
import isArray from './dash.isArray'
import range from './dash.range'

function keys (obj) {
  try {
    return isArray(obj) ? range(obj.length) : Object.keys(obj)
  } catch (err) {
    return []
  }
}

keys._accepts = [Object, Array]
keys._dependencies = [
  'dash.isArray',
  'dash.range'
]

export default keys
