/**
 * Created by edgar on 29/06/15.
 */

module.exports.tasks = {
    ts: {
        development: {
            src: [
                '<%= config.app %>/references.ts',
                '<%= config.app %>/**/*.ts'
            ],
            outDir: 'dist',
            reference: '<%= config.app %>/references.ts',
            options: {
                module: 'amd', // or commonjs
                target: 'es5', // or es3 or es6
                sourceMap: true,
                declaration: true,
                fast: 'never',
                comments: true
            }
        },

        watch: {
            src: [
                '<%= config.app %>/references.ts',
                '<%= config.app %>/**/*.ts'
            ],
            outDir: 'dist',
            reference: '<%= config.app %>/references.ts',
            options: {
                module: 'amd', // or commonjs
                target: 'es5', // or es3 or es6
                sourceMap: true,
                declaration: true,
                fast: 'always',
                comments: true
            }
        },

        release: {
            src: [
                '<%= config.app %>/references.ts',
                '<%= config.app %>/**/*.ts'
            ],
            outDir: 'dist/temp',
            reference: '<%= config.app %>/references.ts',
            options: {
                module: 'amd', // or commonjs
                target: 'es5', // or es3 or es6
                sourceMap: true,
                declaration: true,
                fast: 'never',
                comments: true
            }
        }
    }
};