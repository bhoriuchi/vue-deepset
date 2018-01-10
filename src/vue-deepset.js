/*
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @description Deep set Vue.js objects
 */
import * as _ from './liteutils'
import { getPaths, pathJoin } from './utils'
import Vue from 'vue'

/**
 * deep sets a Vue.js object creating reactive properties if they do not exist
 * @param object
 * @param path
 * @param value
 */
export function vueSet (object, path, value) {
  const parts = _.toPath(path)
  let obj = object

  while (parts.length) {
    const key = parts.shift()
    if (!parts.length) {
      Vue.set(obj, key, value)
    } else if (!_.hasPath(obj, key)) {
      Vue.set(obj, key, key === 'number' ? [] : {})
    }
    obj = obj[key]
  }
}

/**
 * deep sets a vuex object creating reactive properties if they do not exist
 * @param path
 * @param value
 */
export function vuexSet (path, value) {
  if (!this.$store) throw new Error('[vue-deepset]: could not find vuex store object on instance')
  this.$store[this.$store.commit ? 'commit' : 'dispatch']('VUEX_DEEP_SET', { path, value })
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
 * builds a new model object based on the values
 * @param vuexPath
 * @param options
 * @returns {Object}
 */
function buildVuexModel (vuexPath, options) {
  let model = {}

  let obj = _.get(this.$store.state, vuexPath)
  const paths = getPaths(obj)
  _.forEach(paths, path => {
    let propPath = pathJoin(vuexPath, path)
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
 * returns an object that can deep set fields in a vuex store
 * @param vuexPath
 * @returns {Object}
 */
export function vuexModel (vuexPath, options) {
  const opts = Object.assign({}, options)
  if (typeof vuexPath !== 'string' || !vuexPath) {
    throw new Error('[vue-deepset]: invalid vuex path string')
  } else if (!_.hasPath(this.$store.state, vuexPath)) {
    throw new Error(`[vue-deepset]: Cannot find path "${vuexPath}" in Vuex store`)
  } else if (opts.useProxy === false || typeof Proxy === 'undefined') {
    return buildVuexModel.call(this, vuexPath, opts)
  }

  const obj = _.get(this.$store.state, vuexPath)
  const tgt = {
    model: buildVuexModel.call(this, vuexPath, opts)
  }

  return new Proxy(obj, {
    get: (target, property) => {
      if (typeof property === 'symbol') return target[property]
      if (property === 'toJSON') return target.toJSON
      if (property === '_isVue') return false // _isVue is always false
      // add any missing paths to the source object and add the property
      if (
        opts.dynamicUpdates !== false &&
        !_.hasPath(obj, property) &&
        (typeof property === 'string' || typeof property === 'number')
      ) {
        vuexSet.call(this, pathJoin(vuexPath, property), undefined)
        tgt.model = buildVuexModel.call(this, vuexPath, opts)
      }
      return tgt.model[property]
    },
    set: (target, property, value) => {
      if (tgt.model[property] === value) return true
      tgt.model[property] = value
      return true
    },
    has: (target, property) => {
      if (typeof property === 'symbol') return target[property]
      if (property === 'toJSON') return target.toJSON
      if (property === '_isVue') return true
      if (
        opts.dynamicUpdates !== false &&
        !_.hasPath(obj, property) &&
        (typeof property === 'string' || typeof property === 'number')
      ) {
        vuexSet.call(this, pathJoin(vuexPath, property), undefined)
        tgt.model = buildVuexModel.call(this, vuexPath, opts)
      }
      return true
    }
  })
}

/**
 * builds a new model object based on the values
 * @param obj
 * @param options
 * @returns {Object}
 */
function buildVueModel (obj, options) {
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
 * returns an object that can deep set fields in a vue.js object
 * @param obj
 * @returns {Object}
 */
export function vueModel (obj, options) {
  const opts = Object.assign({}, options)
  if (typeof obj !== 'object' || !obj) {
    throw new Error('[vue-deepset]: invalid object specified for vue model')
  } else if (opts.useProxy === false || typeof Proxy === 'undefined') {
    return buildVueModel.call(this, obj, opts)
  }
  const tgt = { model: buildVueModel.call(this, obj, opts) }
  return new Proxy(obj, {
    get: (target, property) => {
      if (typeof property === 'symbol') return target[property]
      if (property === 'toJSON') return target.toJSON
      if (property === '_isVue') return false // _isVue is always false

      if (
        opts.dynamicUpdates !== false &&
        !_.hasPath(tgt.model, property) &&
        (typeof property === 'string' || typeof property === 'number')
      ) {
        vueSet.call(this, obj, property, undefined)
        tgt.model = buildVueModel.call(this, obj, opts)
      }
      return tgt.model[property]
    },
    set: (target, property, value) => {
      if (tgt.model[property] === value) return true
      tgt.model[property] = value
      return true
    },
    has: (target, property) => {
      if (property === '_isVue') return true
      if (typeof property === 'symbol') return target[property]
      if (property === 'toJSON') return target.toJSON

      if (
        opts.dynamicUpdates !== false &&
        !_.hasPath(tgt.model, property) &&
        (typeof property === 'string' || typeof property === 'number')
      ) {
        vueSet.call(this, obj, property, undefined)
        tgt.model = buildVueModel.call(this, obj, opts)
      }
      return true
    }
  })
}

/**
 * creates a vuex model if the arg is a string, vue model otherwise
 * @param arg
 * @returns {Object}
 */
export function deepModel (arg, options) {
  return typeof arg === 'string'
    ? vuexModel.call(this, arg, options)
    : vueModel.call(this, arg, options)
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
