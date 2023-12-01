import terser from '@rollup/plugin-terser';

export default [{
    input: "md5.mjs",
    output: {
        file: "md5.min.mjs",
        format: 'esm',
    },
    plugins: [
        terser({
            compress: {
                ecma: 2017,
                module: true,
                passes: 3,
            },
            mangle: {
                module: true,
            },
            format: {
                comments: false,
            }
        })
    ]
}]
