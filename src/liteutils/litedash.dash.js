'use strict';

/* eslint-disable */
function isArray(obj) {
  return Array.isArray(obj);
}

isArray._accepts = ['ANY'];

/* eslint-disable */
function forEach(obj, fn) {
  try {
    if (isArray(obj)) {
      var idx = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var val = _step.value;

          if (fn(val, idx) === false) break;
          idx++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      for (var key in obj) {
        if (fn(obj[key], key) === false) break;
      }
    }
  } catch (err) {
    return;
  }
}

forEach._accepts = [Object, Array];

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};























































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* eslint-disable */
function uniq(list) {
  return isArray(list) ? [].concat(toConsumableArray(new Set(list))) : [];
}

uniq._accepts = [Array];

/* eslint-disable */
function isString(obj) {
  return typeof obj === 'string';
}

isString._accepts = ['ANY'];

/* eslint-disable */
function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

isObject._accepts = ['ANY'];

/* eslint-disable */
function isFunction(obj) {
  return typeof obj === 'function';
}

isFunction._accepts = ['ANY'];

/* eslint-disable */
function identity(value) {
  return value;
}

identity._accepts = ['ANY'];

/* eslint-disable */
function isNumber(obj) {
  return typeof obj === 'number' && !isNaN(obj);
}

isNumber._accepts = ['ANY'];

/* eslint-disable */
/*
function range (number = 0, increment = 1) {
  return [ ...Array(number).keys() ].map(i => i * increment)
}
*/

function range(start, end, step) {
  if (end === undefined && step === undefined) {
    end = start;
    start = 0;
    step = 1;
  } else if (step === undefined) {
    step = 1;
  }

  // non numbers return empty array
  if (!isNumber(start) || !isNumber(end) || !isNumber(step) || !step) return [];
  if (start === end) return [start];

  var count = start;
  var _range = [];

  if (start < end) {
    while (count < end) {
      _range.push(count);
      count += Math.abs(step);
    }
  } else {
    while (count > end) {
      _range.push(count);
      count -= Math.abs(step);
    }
  }

  return _range;
}

range._accepts = [Number];

/* eslint-disable */
function keys(obj) {
  try {
    return isArray(obj) ? range(obj.length) : Object.keys(obj);
  } catch (err) {
    return [];
  }
}

keys._accepts = [Object, Array];
keys._dependencies = ['dash.isArray', 'dash.range'];

/* eslint-disable */
function reduce(collection, iteratee, accumulator) {
  if (!isObject(collection) && !isArray(collection)) return undefined;
  if (!isFunction(iteratee)) {
    accumulator = iteratee;
    iteratee = identity;
  }

  accumulator = accumulator !== undefined ? accumulator : isArray(collection) ? collection.length ? collection[0] : undefined : keys(collection).length ? collection[keys(collection)[0]] : undefined;

  forEach(collection, function (value, key) {
    accumulator = iteratee(accumulator, value, key, collection);
  });

  return accumulator;
}

reduce._accepts = [Object, Array];
reduce._dependencies = ['dash.forEach', 'dash.isObject', 'dash.isArray', 'dash.isFunction', 'dash.identity', 'dash.keys'];

/* eslint-disable */
function toPath(pathString) {
  // taken from lodash - https://github.com/lodash/lodash
  var pathRx = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;
  var pathArray = [];

  if (isString(pathString)) {
    pathString.replace(pathRx, function (match, number, quote, string) {
      pathArray.push(quote ? string : number !== undefined ? Number(number) : match);
      return pathArray[pathArray.length - 1];
    });
  }
  return pathArray;
}

toPath._accepts = [String];

/* eslint-disable */
function has(obj, path) {
  var found = true;
  var fields = isArray(path) ? path : toPath(path);
  if (!fields.length) return false;
  forEach(fields, function (field) {
    if (obj[field] === undefined) {
      found = false;
      return false;
    }
    obj = obj[field];
  });
  return found;
}

has._accepts = [Object, Array];
has._dependencies = ['dash.forEach', 'dash.isArray', 'dash.toPath'];

/* eslint-disable */
function get$1(obj, path, defaultValue) {
  var value = obj;
  var fields = isArray(path) ? path : toPath(path);
  if (fields.length === 0) return defaultValue;

  try {
    for (var f in fields) {
      if (!value[fields[f]]) return defaultValue;else value = value[fields[f]];
    }
  } catch (err) {
    return defaultValue;
  }
  return value;
}

get$1._accepts = [Object, Array];
get$1._dependencies = ['dash.isArray', 'dash.toPath'];

/* eslint-disable */
var _dash = {
  forEach: forEach,
  uniq: uniq,
  isString: isString,
  reduce: reduce,
  toPath: toPath,
  isArray: isArray,
  has: has,
  isNumber: isNumber,
  get: get$1,
  isObject: isObject,
  isFunction: isFunction,
  identity: identity,
  keys: keys,
  range: range
};

/* eslint-disable */
var DashChain = function DashChain(obj) {
  this._value = obj;
};

DashChain.prototype.value = function () {
  return this._value;
};

var dash = function dash(obj) {
  return new DashChain(obj);
};

var _loop = function _loop(name) {
  var fn = _dash[name];
  dash[name] = fn;
  if (fn._chainable !== false) {
    DashChain.prototype[name] = function () {
      var args = [this._value].concat([].concat(Array.prototype.slice.call(arguments)));
      this._value = fn.apply(this, args);
      return fn._terminates == true ? this._value : this;
    };
  }
};

for (var name in _dash) {
  _loop(name);
}

module.exports = dash;
