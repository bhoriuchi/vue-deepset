"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = forEach;
function forEach(obj, fn, throwErrors) {
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
    if (throwErrors) throw err;
  }
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _toPath = require('./toPath');

function get(object, path, defaultValue) {
  try {
    var obj = object;
    var fields = (0, _toPath.toPath)(path);
    while (fields.length) {
      var prop = fields.shift();
      obj = obj[prop];
      if (!fields.length) return obj;
    }
  } catch (err) {
    return defaultValue;
  }
  return defaultValue;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasPath = hasPath;

var _toPath = require('./toPath');

function hasPath(object, path) {
  try {
    var parts = (0, _toPath.toPath)(path);
    var obj = object;
    while (parts.length) {
      var key = parts.shift();

      if (!Object.prototype.hasOwnProperty.call(object, key)) {
        return false;
      } else if (!parts.length) {
        return true;
      }
      obj = obj[key];
    }
  } catch (err) {
    return false;
  }
  return false;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _forEach = require('./forEach');

Object.defineProperty(exports, 'forEach', {
  enumerable: true,
  get: function get() {
    return _forEach.forEach;
  }
});

var _get = require('./get');

Object.defineProperty(exports, 'get', {
  enumerable: true,
  get: function get() {
    return _get.get;
  }
});

var _hasPath = require('./hasPath');

Object.defineProperty(exports, 'hasPath', {
  enumerable: true,
  get: function get() {
    return _hasPath.hasPath;
  }
});

var _isObjectLike = require('./isObjectLike');

Object.defineProperty(exports, 'isObjectLike', {
  enumerable: true,
  get: function get() {
    return _isObjectLike.isObjectLike;
  }
});

var _toPath = require('./toPath');

Object.defineProperty(exports, 'toPath', {
  enumerable: true,
  get: function get() {
    return _toPath.toPath;
  }
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObjectLike = isObjectLike;
function isObjectLike(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPath = toPath;
/** modified from https://github.com/lodash/lodash */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;

function toPath(path) {
  if (Array.isArray(path)) return path;
  var result = [];
  if (reLeadingDot.test(path)) result.push('');
  path.replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushPaths = pushPaths;
exports.getPaths = getPaths;
exports.buildVuexModel = buildVuexModel;
exports.buildVueModel = buildVueModel;

var _jsutils = require('./jsutils');

var _ = _interopRequireWildcard(_jsutils);

var _set = require('./set');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var INVALID_KEY_RX = /^\d|[^a-zA-Z0-9_]/gm;
var INT_KEY_RX = /^\d+$/;

function pushPaths(obj, current, paths) {
  paths.push(current);
  if (_.isObjectLike(obj)) {
    getPaths(obj, current, paths);
  }
}

function getPaths(obj) {
  var current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var paths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (_.isObjectLike(obj)) {
    _.forEach(obj, function (val, key) {
      if (key.match(INT_KEY_RX) !== null) {
        // is index
        pushPaths(val, (current + '.' + key).replace(/^\./, ''), paths);
        pushPaths(val, (current + '[' + key + ']').replace(/^\./, ''), paths);
        pushPaths(val, (current + '["' + key + '"]').replace(/^\./, ''), paths);
      } else if (key.match(INVALID_KEY_RX) !== null) {
        // must quote
        pushPaths(val, (current + '["' + key + '"]').replace(/^\./, ''), paths);
      } else {
        pushPaths(val, (current + '.' + key).replace(/^\./, ''), paths);
      }
    });
  } else if (Array.isArray(obj)) {
    _.forEach(obj, function (val, idx) {
      pushPaths(val, (current + '.' + idx).replace(/^\./, ''), paths);
      pushPaths(val, (current + '[' + idx + ']').replace(/^\./, ''), paths);
      pushPaths(val, (current + '["' + idx + '"]').replace(/^\./, ''), paths);
    });
  }
  return [].concat(new Set(paths));
}

function buildVuexModel(vuexPath, options) {
  var _this = this;

  var model = {};

  var obj = _.get(this.$store.state, vuexPath);
  var paths = getPaths(obj);
  _.forEach(paths, function (path) {
    var propPath = (0, _set.pathJoin)(vuexPath, path);
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return _.get(_this.$store.state, propPath);
      },
      set: function set(value) {
        _set.vuexSet.call(_this, propPath, value);
      }
    });
  });

  return model;
}

function buildVueModel(obj, options) {
  var _this2 = this;

  var model = {};
  _.forEach(getPaths(obj), function (path) {
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return _.get(obj, path);
      },
      set: function set(value) {
        _set.vueSet.call(_this2, obj, path, value);
      }
    });
  });
  return model;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.VUEX_DEEP_SET = VUEX_DEEP_SET;
exports.extendMutation = extendMutation;
exports.vueModel = vueModel;
exports.vuexModel = vuexModel;
exports.deepModel = deepModel;
exports.install = install;

var _jsutils = require('./jsutils');

var _ = _interopRequireWildcard(_jsutils);

var _set = require('./set');

var _models = require('./models');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function VUEX_DEEP_SET(state, args) {
  (0, _set.vueSet)(state, args.path, args.value);
}

function extendMutation() {
  var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign(mutations, { VUEX_DEEP_SET: VUEX_DEEP_SET });
}

function vueModel(object, options) {
  var _this = this;

  var opts = Object.assign({}, options);

  if (!_.isObjectLike(object)) {
    throw new Error('[vue-deepset]: invalid object specified for vue model');
  } else if (opts.useProxy === false || typeof Proxy === 'undefined') {
    return _models.buildVueModel.call(this, object, opts);
  }

  return new Proxy(object, {
    get: function get(target, property) {
      if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'symbol') return target[property];
      if (property === 'toJSON') return target.toJSON;
      if (property === '_isVue') return false; // _isVue is always false
      return _.get(target, property);
    },
    set: function set(target, property, value) {
      var currentValue = _.get(target, property);
      if (currentValue === value) return true;
      _set.vueSet.call(_this, target, property, value);
      return true;
    },
    has: function has(target, property) {
      return true;
    }
  });
}

function vuexModel(vuexPath, options) {
  var _this2 = this;

  var opts = Object.assign({}, options);
  var object = _.get(this.$store.state, vuexPath);

  if (typeof vuexPath !== 'string' || !vuexPath) {
    throw new Error('[vue-deepset]: invalid vuex path string');
  } else if (!_.isObjectLike(object)) {
    throw new Error('[vue-deepset]: No object at path "' + vuexPath + '" in Vuex store');
  } else if (opts.useProxy === false || typeof Proxy === 'undefined') {
    return _models.buildVuexModel.call(this, vuexPath, opts);
  }

  return new Proxy(object, {
    get: function get(target, property) {
      if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'symbol') return target[property];
      if (property === 'toJSON') return target.toJSON;
      if (property === '_isVue') return false; // _isVue is always false
      return _.get(target, (0, _set.pathJoin)(vuexPath, property));
    },
    set: function set(target, property, value) {
      _set.vuexSet.call(_this2, (0, _set.pathJoin)(vuexPath, property), value);
    },
    has: function has(target, property) {
      return true;
    }
  });
}

/**
 * Returns a deep modeled object
 * @param {*} target
 * @param {*} options
 */
function deepModel(target, options) {
  return typeof target === 'string' ? vuexModel.call(this, target, options) : vueModel.call(this, target, options);
}

/**
 * plugin
 * @param Vue
 */
function install(Vue) {
  Vue.prototype.$deepModel = deepModel;
  Vue.prototype.$vueSet = _set.vueSet;
  Vue.prototype.$vuexSet = _set.vuexSet;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pathJoin = require('./pathJoin');

Object.defineProperty(exports, 'pathJoin', {
  enumerable: true,
  get: function get() {
    return _pathJoin.pathJoin;
  }
});

var _vuexSet = require('./vuexSet');

Object.defineProperty(exports, 'vueSet', {
  enumerable: true,
  get: function get() {
    return _vuexSet.vueSet;
  }
});

var _vueSet = require('./vueSet');

Object.defineProperty(exports, 'vuexSet', {
  enumerable: true,
  get: function get() {
    return _vueSet.vuexSet;
  }
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathJoin = pathJoin;
function pathJoin(base, path) {
  try {
    var connector = path.match(/^\[/) ? '' : '.';
    return '' + (base || '') + (base ? connector : '') + path;
  } catch (error) {
    return '';
  }
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vueSet = vueSet;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _jsutils = require('./jsutils');

var _ = _interopRequireWildcard(_jsutils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function vueSet(object, path, value) {
  var parts = _.toPath(path);
  var obj = object;
  while (parts.length) {
    var key = parts.shift();
    if (!parts.length) {
      _vue2.default.set(obj, key, value);
    } else if (!_.hasPath(obj, key)) {
      _vue2.default.set(obj, key, typeof key === 'number' ? [] : {});
    }
    obj = obj[key];
  }
  return object;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vuexSet = vuexSet;
function vuexSet(path, value) {
  if (!this.$store) throw new Error('[vue-deepset]: could not find vuex store object on instance');
  this.$store[this.$store.commit ? 'commit' : 'dispatch']('VUEX_DEEP_SET', { path: path, value: value });
}
