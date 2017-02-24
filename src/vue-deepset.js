/*
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @description Deep set Vue.js objects
 */
import _ from 'lodash/lodash.min'
import Vue from 'vue'

const INVALID_KEY_RX = /^\d|[^a-zA-Z0-9_]/gm

/**
 * returns true if object is non empty object
 * @param obj
 * @returns {boolean|*}
 */
function isHash (obj) {
  return _.isObject(obj) && !_.isArray(obj) && !_.isDate(obj) && !_.isEmpty(obj)
}

/**
 * generates an array of paths to use when creating an abstracted object
 * @param obj
 * @param current
 * @param paths
 * @returns {Array|*}
 */
function getPaths (obj, current = '', paths = []) {
  if (isHash(obj)) {
    _.forEach(obj, (val, key) => {
      let k = key.match(INVALID_KEY_RX) ? `["${key}"]` : `.${key}`
      let cur = `${current}${k}`.replace(/^\./, '')
      paths.push(cur)
      if (isHash(val)) getPaths(val, cur, paths)
    })
  }
  return _.uniq(paths)
}

/**
 * converts a path string to one usable by deepModel
 * @param path
 * @returns {*}
 */
export function sanitizePath (path) {
  if (!_.isString(path)) throw new Error('VueDeepSet: invalid path, must be string')

  return _.reduce(_.toPath(path), (pathString, part) => {
    let partStr = part.match(INVALID_KEY_RX)
      ? `["${part}"]`
      : `${pathString === '' ? '' : '.'}${part}`
    return pathString + partStr
  }, '')
}

/**
 * deep sets a Vue.js object creating reactive properties if they do not exist
 * @param obj
 * @param path
 * @param value
 */
export function vueSet (obj, path, value) {
  let fields = _.isArray(path) ? path : _.toPath(path)

  for (let i = 0; i < fields.length; i++) {
    let prop = fields[i]
    if (i === fields.length - 1) Vue.set(obj, prop, value)
    else if (!_.has(obj, prop)) Vue.set(obj, prop, _.isNumber(prop) ? [] : {})
    obj = obj[prop]
  }
}

/**
 * deep sets a vuex object creating reactive properties if they do not exist
 * @param path
 * @param value
 */
export function vuexSet (path, value) {
  let store = _.get(this, '$store')
  if (!store) throw new Error('VueDeepSet: could not find vuex store object on instance')
  store[store.commit ? 'commit' : 'dispatch']('VUEX_DEEP_SET', { path, value })
}

/**
 * vuex mutation to set an objects value at a specific path
 * @param state
 * @param args
 */
export function VUEX_DEEP_SET (state, args) {
  vueSet(state, args.path, args.value)
}

/**
 * helper function to extend a mutation object
 * @param mutations
 * @returns {*}
 */
export function extendMutation (mutations = {}) {
  return Object.assign(mutations, { VUEX_DEEP_SET })
}

/**
 * returns an object that can deep set fields in a vuex store
 * @param vuexPath
 * @returns {{}}
 */
export function vuexModel (vuexPath) {
  if (!_.isString(vuexPath)) throw new Error('VueDeepSet: invalid vuex path string')
  let model = {}
  let obj = _.get(this.$store.state, vuexPath)
  _.forEach(getPaths(obj), path => {
    let connector = path.match(/^\[/) ? '' : '.'
    let propPath = `${vuexPath}${connector}${path}`
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: () => {
        return _.get(this.$store.state, propPath)
      },
      set: (value) => {
        vuexSet.call(this, propPath, value)
      }
    })
  })
  return model
}

/**
 * returns an object that can deep set fields in a vue.js object
 * @param obj
 * @returns {Array}
 */
export function vueModel (obj) {
  if (!_.isObject(obj)) throw new Error('VueDeepSet: invalid object')
  let model = {}
  _.forEach(getPaths(obj), path => {
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: () => {
        return _.get(obj, path)
      },
      set: (value) => {
        vueSet.call(this, obj, path, value)
      }
    })
  })
  return model
}

/**
 * creates a vuex model if the arg is a string, vue model otherwise
 * @param arg
 * @returns {{}}
 */
export function deepModel (arg) {
  return _.isString(arg)
    ? vuexModel.call(this, arg)
    : vueModel.call(this, arg)
}

/**
 * plugin
 * @param Vue
 */
export function install (Vue) {
  Vue.prototype.$deepModel = deepModel
  Vue.prototype.$vueSet = vueSet
  Vue.prototype.$vuexSet = vuexSet
}