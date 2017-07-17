/* eslint-disable */
import isArray from './dash.isArray'
import toPath from './dash.toPath'

function get (obj, path, defaultValue) {
  let value = obj
  let fields = isArray(path) ? path : toPath(path)
  if (fields.length === 0) return defaultValue

  try {
    for (let f in fields) {
      if (!value[fields[f]]) return defaultValue
      else value = value[fields[f]]
    }
  } catch (err) {
    return defaultValue
  }
  return value
}

get._accepts = [Object, Array]
get._dependencies = [
  'dash.isArray',
  'dash.toPath'
]

export default get
