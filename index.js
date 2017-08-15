'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

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
  if (isArray(pathString)) return pathString;
  if (isNumber(pathString)) return [pathString];

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
function isDate(obj) {
  return obj instanceof Date;
}

isDate._accepts = ['ANY'];

/* eslint-disable */
function isEmpty(obj) {
  if (obj === '' || obj === null || obj === undefined) return true;
  if ((obj instanceof Buffer || Array.isArray(obj)) && !obj.length) return true;
  if ((obj instanceof Map || obj instanceof Set) && !obj.size) return true;
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Object.keys(obj).length) return true;
  return false;
}

isEmpty._accepts = ['ANY'];

/* eslint-disable */
function has(obj, path) {
  var found = true;
  var fields = isArray(path) ? path : toPath(path);
  if (!fields.length) return false;
  forEach(fields, function (field) {
    if (!obj.hasOwnProperty(field) || obj.hasOwnProperty(field) && obj[field] === undefined) {
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
  isDate: isDate,
  isEmpty: isEmpty,
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
      if (isHash(val) || _.isArray(val)) getPaths(val, cur, paths);
    });
  } else if (_.isArray(obj)) {
    _.forEach(obj, function (val, idx) {
      var cur = current + '[' + idx + ']';
      paths.push(cur);
      if (isHash(val) || _.isArray(val)) getPaths(val, cur, paths);
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
  var prop = fields.shift();

  if (!fields.length) return Vue.set(obj, prop, value);
  if (!_.has(obj, prop)) Vue.set(obj, prop, _.isNumber(prop) ? [] : {});
  vueSet(obj[prop], fields, value);
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
 * builds a new model object based on the values
 * @param vuexPath
 * @param options
 * @returns {Object}
 */
function buildVuexModel(vuexPath, options) {
  var _this = this;

  var model = {};
  var obj = _.get(this.$store.state, vuexPath, this.$store.state);
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
}

/**
 * returns an object that can deep set fields in a vuex store
 * @param vuexPath
 * @returns {Object}
 */
function vuexModel(vuexPath, options) {
  var _this2 = this;

  if (!_.isString(vuexPath)) throw new Error('VueDeepSet: invalid vuex path string');
  options = isHash(options) ? options : {};

  if (options.useProxy === false || (typeof Proxy === 'undefined' ? 'undefined' : _typeof(Proxy)) === undefined) {
    return buildVuexModel.call(this, vuexPath, options);
  } else {
    var obj = _.get(this.$store.state, vuexPath, this.$store.state);
    var tgt = { model: buildVuexModel.call(this, vuexPath, options) };
    return new Proxy(obj, {
      get: function get$$1(target, property) {
        if (!(property in tgt.model)) {
          vuexSet.call(_this2, pathJoin(vuexPath, property), undefined);
          tgt.model = buildVuexModel.call(_this2, vuexPath, options);
        }
        return _.get(_this2.$store.state, pathJoin(vuexPath, property));
      },
      set: function set$$1(target, property, value) {
        vuexSet.call(_this2, pathJoin(vuexPath, property), value);
        return true;
      },
      has: function has$$1(target, property) {
        if (!(property in tgt.model)) {
          vuexSet.call(_this2, pathJoin(vuexPath, property), undefined);
          tgt.model = buildVuexModel.call(_this2, vuexPath, options);
        }
        return true;
      }
    });
  }
}

/**
 * builds a new model object based on the values
 * @param obj
 * @param options
 * @returns {Object}
 */
function buildVueModel(obj, options) {
  var _this3 = this;

  var model = {};
  _.forEach(getPaths(obj), function (path) {
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get$$1() {
        return _.get(obj, path);
      },
      set: function set$$1(value) {
        vueSet.call(_this3, obj, path, value);
      }
    });
  });
  return model;
}

/**
 * returns an object that can deep set fields in a vue.js object
 * @param obj
 * @returns {Array}
 */
function vueModel(obj, options) {
  var _this4 = this;

  if (!_.isObject(obj)) throw new Error('VueDeepSet: invalid object');
  options = isHash(options) ? options : {};

  // make _isVue non-enumerable
  Object.defineProperty(obj, '_isVue', {
    enumerable: false,
    writable: true
  });

  if (options.useProxy === false || typeof Proxy === 'undefined') {
    return buildVueModel.call(this, obj, options);
  } else {
    var tgt = { model: buildVueModel.call(this, obj, options) };
    return new Proxy(obj, {
      get: function get$$1(target, property) {
        if (!(property in tgt.model)) {
          vueSet.call(_this4, obj, property, undefined);
          tgt.model = buildVueModel.call(_this4, obj, options);
        }
        return tgt.model[property];
      },
      set: function set$$1(target, property, value) {
        vueSet.call(_this4, tgt.model, property, value);
        return true;
      },
      has: function has$$1(target, property) {
        if (!(property in tgt.model)) {
          vueSet.call(_this4, obj, property, undefined);
          tgt.model = buildVueModel.call(_this4, obj, options);
        }
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
function deepModel(arg, options) {
  return _.isString(arg) ? vuexModel.call(this, arg, options) : vueModel.call(this, arg, options);
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
