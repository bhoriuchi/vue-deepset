/* eslint-disable */
import isArray from './dash.isArray'

function uniq (list) {
  return isArray(list) ? [ ...new Set(list) ] : []
}

uniq._accepts = [Array]

export default uniq
