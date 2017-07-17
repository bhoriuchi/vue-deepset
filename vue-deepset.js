(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VueDeepSet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault$1((window.Vue));

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
var _ = {
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

/*
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @description Deep set Vue.js objects
 */
var INVALID_KEY_RX = /^\d|[^a-zA-Z0-9_]/gm;

/**
 * returns true if object is non empty object
 * @param obj
 * @returns {boolean|*}
 */
function isHash(obj) {
  return _.isObject(obj) && !_.isArray(obj) && !_.isDate(obj) && !_.isEmpty(obj);
}

/**
 * joins 2 paths
 * @param base
 * @param path
 * @returns {string}
 */
function pathJoin(base, path) {
  try {
    var connector = path.match(/^\[/) ? '' : '.';
    return '' + (base ? base : '') + (base ? connector : '') + path;
  } catch (error) {
    return '';
  }
}

/**
 * generates an array of paths to use when creating an abstracted object
 * @param obj
 * @param current
 * @param paths
 * @returns {Array|*}
 */
function getPaths(obj) {
  var current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var paths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (isHash(obj)) {
    _.forEach(obj, function (val, key) {
      var k = key.match(INVALID_KEY_RX) ? '["' + key + '"]' : '.' + key;
      var cur = ('' + current + k).replace(/^\./, '');
      paths.push(cur);
      if (isHash(val)) getPaths(val, cur, paths);
    });
  }
  return _.uniq(paths);
}

/**
 * converts a path string to one usable by deepModel
 * @param path
 * @returns {*}
 */
function sanitizePath(path) {
  if (!_.isString(path)) throw new Error('VueDeepSet: invalid path, must be string');

  return _.reduce(_.toPath(path), function (pathString, part) {
    var partStr = part.match(INVALID_KEY_RX) ? '["' + part + '"]' : '' + (pathString === '' ? '' : '.') + part;
    return pathString + partStr;
  }, '');
}

/**
 * deep sets a Vue.js object creating reactive properties if they do not exist
 * @param obj
 * @param path
 * @param value
 */
function vueSet(obj, path, value) {
  var fields = _.isArray(path) ? path : _.toPath(path);
  for (var i = 0; i < fields.length; i++) {
    var prop = fields[i];
    if (i === fields.length - 1) Vue.set(obj, prop, value);else if (!_.has(obj, prop)) Vue.set(obj, prop, _.isNumber(prop) ? [] : {});
    obj = obj[prop];
  }
}

/**
 * deep sets a vuex object creating reactive properties if they do not exist
 * @param path
 * @param value
 */
function vuexSet(path, value) {
  var store = _.get(this, '$store');
  if (!store) throw new Error('VueDeepSet: could not find vuex store object on instance');
  store[store.commit ? 'commit' : 'dispatch']('VUEX_DEEP_SET', { path: path, value: value });
}

/**
 * vuex mutation to set an objects value at a specific path
 * @param state
 * @param args
 */
function VUEX_DEEP_SET(state, args) {
  vueSet(state, args.path, args.value);
}

/**
 * helper function to extend a mutation object
 * @param mutations
 * @returns {*}
 */
function extendMutation() {
  var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign(mutations, { VUEX_DEEP_SET: VUEX_DEEP_SET });
}

/**
 * returns an object that can deep set fields in a vuex store
 * @param vuexPath
 * @returns {{}}
 */
function vuexModel(vuexPath) {
  var _this = this;

  if (!_.isString(vuexPath)) throw new Error('VueDeepSet: invalid vuex path string');

  if ((typeof Proxy === 'undefined' ? 'undefined' : _typeof(Proxy)) === undefined) {
    var model = {};
    var obj = _.get(this.$store.state, vuexPath);
    _.forEach(getPaths(obj), function (path) {
      var propPath = pathJoin(vuexPath, path);
      Object.defineProperty(model, path, {
        configurable: true,
        enumerable: true,
        get: function get$$1() {
          return _.get(_this.$store.state, propPath);
        },
        set: function set$$1(value) {
          vuexSet.call(_this, propPath, value);
        }
      });
    });
    return model;
  } else {
    return new Proxy(_.get(this.$store.state, vuexPath, this.$store.state), {
      get: function get$$1(target, property) {
        return _.get(_this.$store.state, pathJoin(vuexPath, property));
      },
      set: function set$$1(target, property, value) {
        vuexSet.call(_this, pathJoin(vuexPath, property), value);
        return true;
      },
      has: function has$$1(target, property) {
        return true;
      }
    });
  }
}

/**
 * returns an object that can deep set fields in a vue.js object
 * @param obj
 * @returns {Array}
 */
function vueModel(obj) {
  var _this2 = this;

  if (!_.isObject(obj)) throw new Error('VueDeepSet: invalid object');

  if (typeof Proxy === 'undefined') {
    var model = {};
    _.forEach(getPaths(obj), function (path) {
      Object.defineProperty(model, path, {
        configurable: true,
        enumerable: true,
        get: function get$$1() {
          return _.get(obj, path);
        },
        set: function set$$1(value) {
          vueSet.call(_this2, obj, path, value);
        }
      });
    });
    return model;
  } else {
    return new Proxy(obj, {
      get: function get$$1(target, property) {
        return _.get(target, property);
      },
      set: function set$$1(target, property, value) {
        vueSet.call(_this2, target, property, value);
        return true;
      },
      has: function has$$1(target, property) {
        return true;
      }
    });
  }
}

/**
 * creates a vuex model if the arg is a string, vue model otherwise
 * @param arg
 * @returns {{}}
 */
function deepModel(arg) {
  return _.isString(arg) ? vuexModel.call(this, arg) : vueModel.call(this, arg);
}

/**
 * plugin
 * @param Vue
 */
function install(Vue$$1) {
  Vue$$1.prototype.$deepModel = deepModel;
  Vue$$1.prototype.$vueSet = vueSet;
  Vue$$1.prototype.$vuexSet = vuexSet;
}

exports.sanitizePath = sanitizePath;
exports.vueSet = vueSet;
exports.vuexSet = vuexSet;
exports.VUEX_DEEP_SET = VUEX_DEEP_SET;
exports.extendMutation = extendMutation;
exports.vuexModel = vuexModel;
exports.vueModel = vueModel;
exports.deepModel = deepModel;
exports.install = install;

},{}]},{},[1])(1)
});