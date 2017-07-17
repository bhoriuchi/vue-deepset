/* eslint-disable */
function isNumber (obj) {
  return typeof obj === 'number' && !isNaN(obj)
}

isNumber._accepts = ['ANY']

export default isNumber
