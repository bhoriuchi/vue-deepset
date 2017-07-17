/* eslint-disable */
import isNumber from './dash.isNumber'

/*
function range (number = 0, increment = 1) {
  return [ ...Array(number).keys() ].map(i => i * increment)
}
*/

function range (start, end, step) {
  if (end === undefined && step === undefined) {
    end = start
    start = 0
    step = 1
  } else if (step === undefined) {
    step = 1
  }

  // non numbers return empty array
  if (!isNumber(start) || !isNumber(end) || !isNumber(step) || !step) return []
  if (start === end) return [start]

  let count = start
  let _range = []

  if (start < end) {
    while (count < end) {
      _range.push(count)
      count += Math.abs(step)
    }
  } else {
    while (count > end) {
      _range.push(count)
      count -= Math.abs(step)
    }
  }

  return _range
}

range._accepts = [Number]

export default range
