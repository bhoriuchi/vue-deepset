import _dash from './dash'

let DashChain = function (obj) {
  this._value = obj
}

DashChain.prototype.value = function () {
  return this._value
}

let dash = function (obj) {
  return new DashChain(obj)
}

for (const name in _dash) {
  let fn = _dash[name]
  dash[name] = fn
  if (fn._chainable !== false) {
    DashChain.prototype[name] = function () {
      let args = [this._value].concat([ ...arguments ])
      this._value = fn.apply(this, args)
      return fn._terminates === true ? this._value : this
    }
  }
}

export default dash
