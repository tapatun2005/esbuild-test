import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { watch } from 'chokidar'
import Handlebars from 'handlebars'
// Live server
import { server } from './server.js'
// Claen 
import { clean } from './clean.js'

// Plugins
import dynamicImportsPlugin from './plugins/dynamic-imports-plugin.js'

// Define mode
const isDev = !process.argv.includes('--production')

// Options
const options = {
    entryPoints: ['src/js/App.js'],
    entryNames: isDev ? '[dir]/[name]' : '[dir]/[name]-[hash]',
    outdir: 'dist/static/js',
    minify: !isDev,
    watch: isDev,
    sourcemap: isDev,
    bundle: true,
    splitting: true,
    format: 'esm',
    metafile: true,
    incremental: true,
    chunkNames: isDev ? 'chunks/[name]' : 'chunks/[name]-[hash]',
    plugins: [ 
        dynamicImportsPlugin
    ]
}

// Build
// ---------------------------
const build = async () => {
    const results = await esbuild.build(options)

    // Watch template changes
    watch(['./src/templates/**/*.html']).on('all', (event, location) => {
        // Find script path
        const script =
            Object.keys(results.metafile.outputs).filter(output => {
                return results.metafile.outputs[output].entryPoint === options.entryPoints[0]
            }).toString().replace('dist', '')
        
        // HTML tasks
        const templateStr = fs.readFileSync(path.resolve(location), 'utf8')
        const data = Handlebars.compile(templateStr)
        // Check for dist folder
        const dirName = path.dirname(`./dist/${location.replace('src/templates/', '')}`)
        if(!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }
        // End distFolder

        fs.writeFileSync(path.join(`./dist/${location.replace('src/templates/', '')}`), data({script}))
    })

    // Watch JS changes
    // -------------------------------------------
    const jsWatcher =  watch(['./src/js/**/*.js'], {
        ignoreInitial: true
    })

    jsWatcher.on('add', (path) => {
        console.log(`File ${path} was added`)
        results.rebuild(options).dispose
    })

    jsWatcher.on('unlink', (path) => {
        console.log(`File ${path} was removed`)
    })
    // -------------------------------------------
    if (results) {
        return true
    }
}

const run = async () => {
    const cleaned = await clean()
    if (cleaned) {   
        const isBuild = await build()
        if (isDev && isBuild) {
            server()
        } else {
            console.log("⚡ Build complete! ⚡")
            process.exit(1)
        }
    }
}

run()

// ---------------------------