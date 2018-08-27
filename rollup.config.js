import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

export default {
    input: 'src/sleet.ts',
    plugins: [
        typescript({
            typescript: require('typescript'),
            module: 'es6'
        }),
        commonjs(),
        babel({
            presets: ['es2015-rollup']
        }),
        uglify()
    ],
    output: {
        file: 'dist/sleet.min.js',
        format: 'umd',
        name: 'Sleet',
        sourcemap: true
    }
}
