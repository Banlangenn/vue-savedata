
// rollup.config.js
// import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser'
export default {    
  input: './packages/index.js',
  output: {
    name: 'vue-savedata.umd',
    file: './lib/vue-savedata.umd.js',
    format: 'umd'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      runtimeHelpers: true
    }),
    terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
    })
  ]
};