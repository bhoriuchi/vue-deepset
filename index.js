'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash/lodash.min'));
var Vue = _interopDefault(require('vue'));

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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
      var cur = ('' + current + k).replace(/^./, '');
      paths.push(cur);
      if (isHash(val)) getPaths(obj, cur, paths);
    });
  }
  return _.uniq(paths);
}

var VUEX_DEEP_SET = 'VUEX_DEEP_SET';

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
 * vuex mutation to set an objects value at a specific path
 * @param state
 * @param args
 */
function mutation(state, args) {
  vueSet(state, args.path, args.value);
}

/**
 * helper function to extend a mutation object
 * @param mutations
 * @returns {*}
 */
function extendMutation() {
  var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign(mutations, defineProperty({}, VUEX_DEEP_SET, mutation));
}

/**
 * returns an object that can deep set fields in a vuex store
 * @param vuexPath
 * @returns {{}}
 */
function vuexModel(vuexPath) {
  var _this = this;

  var model = {};
  var obj = _.get(this.$store.state, vuexPath);
  _.forEach(getPaths(obj), function (path) {
    var connector = path.match(/^\[/) ? '' : '.';
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get$$1() {
        return _.get(_this.$store.state, '' + vuexPath + connector + path);
      },
      set: function set$$1(value) {
        _this.$store[_this.$store.commit ? 'commit' : 'dispatch'](VUEX_DEEP_SET, {
          path: '' + vuexPath + connector + path,
          value: value
        });
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
function vueModel(obj) {
  var model = {};
  _.forEach(getPaths(obj), function (path) {
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get$$1() {
        return _.get(obj, path);
      },
      set: function set$$1(value) {
        vueSet(obj, path, value);
      }
    });
  });
  return model;
}

exports.VUEX_DEEP_SET = VUEX_DEEP_SET;
exports.vueSet = vueSet;
exports.mutation = mutation;
exports.extendMutation = extendMutation;
exports.vuexModel = vuexModel;
exports.vueModel = vueModel;
