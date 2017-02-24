import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/vue-deepset.js',
  format: 'cjs',
  plugins: [ babel() ],
  external: ['lodash/lodash.min', 'vue'],
  dest: 'vue-deepset.js'
}