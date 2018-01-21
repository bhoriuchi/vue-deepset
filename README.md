# vue-deepset
Deep set Vue.js objects using dynamic paths

---

Binding deeply nested data properties and vuex data to a form or component can be tricky. The following set of tools aims to simplify data bindings. Compatible with `Vue 1.x`, `Vue 2.x`, `Vuex 1.x`, and `Vuex 2.x`

**Note** `vueModel` and `vuexModel` use [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) objects if supported by the browser and fallback to an object with generated fields based on the target object. Because of this, it is always best to pre-define the properties of an object when using older browsers.

Also note that models are flat and once built can set vue/vuex directly using `model[path] = value` where path is a lodash formatted path string or path array.

### Examples

Full examples can be found in the [tests](https://github.com/bhoriuchi/vue-deepset/tree/master/test) folder on the project repo

### Requirements

* `vue@>=1.0.0`
* `vuex@>=1.0.0` (optional)

### Dynamic paths

If you knew what every path you needed ahead of time you could (while tedious) create custom computed properties with getter and setter methods for each of those properties. But what if you have a dynamic and deeply nested property? This problem was actually what inspired the creation of this library. Using a Proxy, `vue-deepset` is able to dynamically create new, deep, reactive properties as well as return `undefined` for values that are not yet set.

### Path Strings

The modeling methods use `lodash.toPath` format for path strings. Please ensure references use this format. You may also use `path Arrays` which can be easier to construct when using keys that include dots.

The following 2 path values are the same
```js
const stringPath = 'a.b["c.d"].e[0]'
const arrayPath  = [ 'a', 'b', 'c.d', 'e', 0 ]
```

#### Keys with dots

Since dots prefix a nested path and are also valid characters for a key data that looks like the following can be tricky

```js
const data = {
  'foo.bar': 'baz',
  foo: {
    bar: 'qux'
  }
}
```

So care should be taken when building the path string (or just use an array path) as the following will be true

```js
'foo.bar' // qux
'["foo.bar"]' // baz
'foo["bar"]' // qux
'["foo"].bar' // qux
```

### Binding `v-model` to deeply nested objects

Model objects returned by `$deepModel`, `vueModel`, and `vuexModel` are flat and use getter/setter methods to access and update deep properties on the target object. Because of this, when binding a deep model object using `v-model` bracket notation should be used and the property value should be a path string. Using not notation past a single level object should be avoided.

```html
<input type="text" v-model="model.prop1">
<input type="text" v-model="model['prop1.subprop']">
<input type="text" v-model="model['path.to[&quot;deep nested&quot;]']">
```

## Usage

* Webpack `import * as VueDeepSet from 'vue-deepset'`
* Browser `<script src='./node_modules/vue-deepset/vue-deepset.min.js'></script>`

### As a Plugin

The easiest way to set up `vue-deepset` is as a Vue.js plugin. The plugin adds instance methods `$deepModel`, `$vueSet`, and `$vuexSet`. For **vuex** a mutation must be added (see vuex section).

When using ES6+ use `import * as VueDeepSet from 'vue-deepset'`

* `$deepModel ( obj:Object )` - for local vue objects
* `$deepModel ( path:String )` - for vuex state properties; path to base object
* `$vueSet (obj:Object, path:String, value:*)`
* `$vuexSet (path:String, value:*)`

#### Example - Browser (Vue 2.x)

**html**
```html
<div id="app">
  <input type="text" v-model="model['input1']">
  <input type="text" v-model="model['path.to[&quot;deep nested&quot;]']">
</div>
```

**js**
```js
Vue.use(VueDeepSet)

var app = new Vue({
  el: '#app',
  store,
  computed: {
    model () {
      return this.$deepModel(this.obj)
    }
  },
  data: {
    obj: {
      input1: 'Hello World!',
      path: {
        to: {
          'deep nested': 'Hello Vue!'
        }
      }
    }
  }
})

```

### Vuex

Form binding to `vuex` using `v-model` requires registering the provided `VUEX_DEEP_SET` mutation. A convienience method `extendMutation` has been provided.

**html**
```html
<div id="app">
  <input type="text" v-model="formData['message']">
</div>
```

**js**
```js
var store = new Vuex.Store({
  state: {
    formData: {
      message: 'Hello Vuex!'
    }
  },
  mutations: VueDeepSet.extendMutation({
    // other mutations
  })
})

var app = new Vue({
  el: '#app',
  store,
  computed: {
    formData () {
      return this.$deepModel('formData')
    }
  }
})
```
or

```js
var store = new Vuex.Store({
  state: {
    formData: {
      message: 'Hello Vuex!'
    }
  },
  mutations: {
    VUEX_DEEP_SET: VueDeepSet.VUEX_DEEP_SET,
    // other mutations
  }
})

var app = new Vue({
  el: '#app',
  store,
  computed: {
    formData () {
      return this.$deepModel('formData')
    }
  }
})
```

### API

##### vueSet ( obj:Object, path:String, value:* )

Deep sets a path with a value on a local data object so that is is reactive

##### vuexSet ( path:String, value:* )

Deep sets a path with a value in a vuex store so that it is reactive

##### VUEX_DEEP_SET ( state:VuexState, args:Object )

Vuex mutation that should be registered when using vuexSet

##### extendMutation ( [mutations:Object] )

Adds the `VUEX_DEEP_SET` mutation to an optional hash of mutations and returns an updated hash of mutations

##### vueModel ( obj:Object, [options:Object] )

Creates an abstracted model with a set of flat properties that are generated from inspecting the objects properties so that deeply nested properties can be accessed as first level properties

**options**
* `useProxy=true` {`Boolean`} - disable use of Proxy when false

##### vuexModel ( path:String, [options:Object] )

The equivalent of `vueModel` for `vuex`. Path should point to the base object

**options**
* `useProxy=true` {`Boolean`} - disable use of Proxy when false

##### deepModel ( obj:Object, [options:Object] )

Equivalent to `vueModel`

**options**
* `useProxy=true` {`Boolean`} - disable use of Proxy when false

##### deepModel ( path:String, [options:Object] )

Equivalent to `vuexModel`

**options**
* `useProxy=true` {`Boolean`} - disable use of Proxy when false

### Non-Plugin usage

##### Example - Browser

```js
var store = new Vuex.Store({
  state: {
    formData: {
      message: 'Hello Vuex!'
    }
  },
  mutations: VueDeepSet.extendMutation()
})

var app = new Vue({
  el: '#app',
  store,
  computed: {
    vuexForm () {
      return this.vuexModel('formData')
    },
    localForm () {
      return this.vueModel(this.localForm)
    }
  },
  methods: {
    vueSet: VueDeepSet.vueSet,
    vuexSet: VueDeepSet.vuexSet,
    vueModel: VueDeepSet.vueModel,
    vuexModel: VueDeepSet.vuexModel
  },
  data: {
    localForm: {
      message: 'Hello Vue!'
    }
  }
})
```

### Example - Webpack + ES6

```js
import { vueSet } from 'vue-deepset'

export default {
  methods: {
    clearForm () {
      vueSet(this.localForm, 'message', '')
    }
  },
  data: {
    localForm: {
      message: 'Hello Vue!'
    }
  }
}
```