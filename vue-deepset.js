(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VueDeepSet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault$1((window.Vue));

/**
 * Converts a path string into a path array
 * @param pathString
 * @returns {Array}
 */
function toPath(pathString) {
  if (Array.isArray(pathString)) return pathString;
  if (typeof pathString === 'number') return [pathString];
  pathString = String(pathString);

  // taken from lodash - https://github.com/lodash/lodash
  var pathRx = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;
  var pathArray = [];

  pathString.replace(pathRx, function (match, number, quote, string) {
    pathArray.push(quote ? string : number !== undefined ? Number(number) : match);
    return pathArray[pathArray.length - 1];
  });
  return pathArray;
}

/**
 * loops through an object and executes the function
 * @param obj
 * @param fn
 */
function forEach(obj, fn) {
  try {
    if (Array.isArray(obj)) {
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

/**
 * gets a value from a specific path - modified from lodash.js
 * @param obj
 * @param path
 * @param defaultValue
 * @returns {*}
 */
function get(obj, path, defaultValue) {
  var fields = Array.isArray(path) ? path : toPath(path);
  var idx = 0;
  var length = fields.length;

  while (obj !== null && idx < length) {
    obj = obj[fields[idx++]];
  }

  return idx && idx === length ? obj : defaultValue;
}

/**
 * checks if a path exists - modified from lodash.js
 * @param object
 * @param path
 * @returns {boolean}
 */
function hasPath(object, path) {
  path = toPath(path);

  var index = -1;
  var _path = path,
      length = _path.length;

  var result = false;
  var key = void 0;

  while (++index < length) {
    key = path[index];
    if (!(result = object != null && Object.prototype.hasOwnProperty.call(object, key))) {
      break;
    }
    object = object[key];
  }

  return result;
}

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

var INVALID_KEY_RX = /^\d|[^a-zA-Z0-9_]/gm;

/**
 * returns true if object is non empty object
 * @param obj
 * @returns {boolean|*}
 */
function isHash(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj) && !(obj instanceof Date) && obj !== null;
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
    forEach(obj, function (val, key) {
      var k = key.match(INVALID_KEY_RX) ? '["' + key + '"]' : '.' + key;
      var cur = ('' + current + k).replace(/^\./, '');
      paths.push(cur);
      if (isHash(val) || Array.isArray(val)) getPaths(val, cur, paths);
    });
  } else if (Array.isArray(obj)) {
    forEach(obj, function (val, idx) {
      var cur = current + '[' + idx + ']';
      paths.push(cur);
      if (isHash(val) || Array.isArray(val)) getPaths(val, cur, paths);
    });
  }
  return [].concat(toConsumableArray(new Set(paths)));
}

/*
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @description Deep set Vue.js objects
 */
/**
 * deep sets a Vue.js object creating reactive properties if they do not exist
 * @param obj
 * @param path
 * @param value
 */
function vueSet(obj, path, value) {
  var fields = Array.isArray(path) ? path : toPath(path);
  var prop = fields.shift();

  if (!fields.length) return Vue.set(obj, prop, value);
  if (!hasPath(obj, prop) || obj[prop] === null) {
    Vue.set(obj, prop, fields.length >= 1 && typeof fields[0] === 'number' ? [] : {});
  }

  vueSet(obj[prop], fields, value);
}

/**
 * deep sets a vuex object creating reactive properties if they do not exist
 * @param path
 * @param value
 */
function vuexSet(path, value) {
  if (!this.$store) throw new Error('[vue-deepset]: could not find vuex store object on instance');
  this.$store[this.$store.commit ? 'commit' : 'dispatch']('VUEX_DEEP_SET', { path: path, value: value });
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

  var obj = get(this.$store.state, vuexPath);
  forEach(getPaths(obj), function (path) {
    var propPath = pathJoin(vuexPath, path);
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get$$1() {
        return get(_this.$store.state, propPath);
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

  if (typeof vuexPath !== 'string' || !vuexPath) throw new Error('[vue-deepset]: invalid vuex path string');
  if (!hasPath(this.$store.state, vuexPath)) throw new Error('[vue-deepset]: Cannot find path "' + vuexPath + '" in Vuex store');
  options = isHash(options) ? options : {};

  // non-proxy
  if (options.useProxy === false || (typeof Proxy === 'undefined' ? 'undefined' : _typeof(Proxy)) === undefined) {
    return buildVuexModel.call(this, vuexPath, options);
  }

  var obj = get(this.$store.state, vuexPath);
  var tgt = { model: buildVuexModel.call(this, vuexPath, options) };

  return new Proxy(obj, {
    get: function get$$1(target, property) {
      if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'symbol') return target[property];
      if (property === 'toJSON') return target.toJSON;
      if (property === '_isVue') return false; // _isVue is always false
      // add any missing paths to the source object and add the property
      if (!hasPath(obj, property) && (typeof property === 'string' || typeof property === 'number')) {
        vuexSet.call(_this2, pathJoin(vuexPath, property), undefined);
        tgt.model = buildVuexModel.call(_this2, vuexPath, options);
      }
      return tgt.model[property];
    },
    set: function set$$1(target, property, value) {
      if (tgt.model[property] === value) return true;
      tgt.model[property] = value;
      return true;
    },
    has: function has(target, property) {
      if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'symbol') return target[property];
      if (property === 'toJSON') return target.toJSON;
      if (property === '_isVue') return true;
      if (!hasPath(obj, property) && (typeof property === 'string' || typeof property === 'number')) {
        vuexSet.call(_this2, pathJoin(vuexPath, property), undefined);
        tgt.model = buildVuexModel.call(_this2, vuexPath, options);
      }
      return true;
    }
  });
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
  forEach(getPaths(obj), function (path) {
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get$$1() {
        return get(obj, path);
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
 * @returns {Object}
 */
function vueModel(obj, options) {
  var _this4 = this;

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || !obj) throw new Error('[vue-deepset]: invalid object specified for vue model');
  options = isHash(options) ? options : {};

  if (options.useProxy === false || typeof Proxy === 'undefined') {
    return buildVueModel.call(this, obj, options);
  } else {
    var tgt = { model: buildVueModel.call(this, obj, options) };
    return new Proxy(obj, {
      get: function get$$1(target, property) {
        if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'symbol') return target[property];
        if (property === 'toJSON') return target.toJSON;
        if (property === '_isVue') return false; // _isVue is always false

        if (!hasPath(tgt.model, property) && (typeof property === 'string' || typeof property === 'number')) {
          vueSet.call(_this4, obj, property, undefined);
          tgt.model = buildVueModel.call(_this4, obj, options);
        }
        return tgt.model[property];
      },
      set: function set$$1(target, property, value) {
        if (tgt.model[property] === value) return true;
        tgt.model[property] = value;
        return true;
      },
      has: function has(target, property) {
        if (property === '_isVue') return true;
        if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'symbol') return target[property];
        if (property === 'toJSON') return target.toJSON;

        if (!hasPath(tgt.model, property) && (typeof property === 'string' || typeof property === 'number')) {
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
 * @returns {Object}
 */
function deepModel(arg, options) {
  return typeof arg === 'string' ? vuexModel.call(this, arg, options) : vueModel.call(this, arg, options);
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