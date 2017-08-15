/* eslint-disable */
function isDate (obj) {
  return obj instanceof Date
}

isDate._accepts = ['ANY']

export default isDate
