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
      let cur = `${current}${k}`.replace(/^./, '')
      paths.push(cur)
      if (isHash(val)) getPaths(obj, cur, paths)
    })
  }
  return _.uniq(paths)
}

export const VUEX_DEEP_SET = 'VUEX_DEEP_SET'

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
 * vuex mutation to set an objects value at a specific path
 * @param state
 * @param args
 */
export function mutation (state, args) {
  vueSet(state, args.path, args.value)
}

/**
 * helper function to extend a mutation object
 * @param mutations
 * @returns {*}
 */
export function extendMutation (mutations = {}) {
  return Object.assign(mutations, {
    [VUEX_DEEP_SET]: mutation
  })
}

/**
 * returns an object that can deep set fields in a vuex store
 * @param vuexPath
 * @returns {{}}
 */
export function vuexModel (vuexPath) {
  let model = {}
  let obj = _.get(this.$store.state, vuexPath)
  _.forEach(getPaths(obj), path => {
    let connector = path.match(/^\[/) ? '' : '.'
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: () => {
        return _.get(this.$store.state, `${vuexPath}${connector}${path}`)
      },
      set: (value) => {
        this.$store[this.$store.commit ? 'commit' : 'dispatch'](VUEX_DEEP_SET, {
          path: `${vuexPath}${connector}${path}`,
          value
        })
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
  let model = {}
  _.forEach(getPaths(obj), path => {
    Object.defineProperty(model, path, {
      configurable: true,
      enumerable: true,
      get: () => {
        return _.get(obj, path)
      },
      set: (value) => {
        vueSet(obj, path, value)
      }
    })
  })
  return model
}
