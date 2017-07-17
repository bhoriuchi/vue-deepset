/* eslint-disable */
import forEach from './dash.forEach'
import isObject from './dash.isObject'
import isArray from './dash.isArray'
import isFunction from './dash.isFunction'
import identity from './dash.identity'
import keys from './dash.keys'

function reduce (collection, iteratee, accumulator) {
  if (!isObject(collection) && !isArray(collection)) return undefined
  if (!isFunction(iteratee)) {
    accumulator = iteratee
    iteratee = identity
  }

  accumulator = (accumulator !== undefined)
    ? accumulator
    : isArray(collection)
      ? collection.length
        ? collection[0]
        : undefined
      : keys(collection).length
        ? collection[keys(collection)[0]]
        : undefined

  forEach(collection, (value, key) => {
    accumulator = iteratee(accumulator, value, key, collection)
  })

  return accumulator
}

reduce._accepts = [Object, Array]
reduce._dependencies = [
  'dash.forEach',
  'dash.isObject',
  'dash.isArray',
  'dash.isFunction',
  'dash.identity',
  'dash.keys'
]

export default reduce
