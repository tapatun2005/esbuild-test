import CONFIGS from '../config.js'

import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { watch } from 'chokidar'
// Live server
import { server } from './server.js'
// Clean 
import { clean } from './clean.js'

// Tasks
import { html } from './tasks/html.js'

// Plugins
import dynamicImportsPlugin from './plugins/dynamic-imports-plugin.js'
import {sassPlugin} from 'esbuild-sass-plugin'

// Define mode
const isDev = !process.argv.includes('--production')

// Options
const options = {
    entryPoints: ['src/js/App.js'],
    entryNames: isDev ? '[dir]/[name]' : '[dir]/[name]-[hash]',
    outdir: `dist/static/js`,
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
        dynamicImportsPlugin,
        sassPlugin()
    ]
}

let results = null

// Build
// ---------------------------
const build = async () => {
    results = await esbuild.build(options)

    if(results) {
         // Find script path
        const script =
        Object.keys(results.metafile.outputs).filter(output => {
            return results.metafile.outputs[output].entryPoint === options.entryPoints[0]
        }).toString().replace('dist', '')

        // HTML task 
        const taskHTML = await html(script)

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
        if (taskHTML) {
            console.log('html', 'true')
           return true
        } else {
            console.log('html', 'false')
            return false
        }
    }
}

const run = async () => {
    let cleaned = await clean()
    if (cleaned) {   
        const isBuild = await build()
        if (isDev && isBuild) {
            server()
        } else if (isBuild && !isDev) {
            console.log("⚡ Build complete! ⚡")
            process.exit(1)
        }
    }
}

// run()

// ---------------------------

import { taskClean } from './tasks/clean.js'

const taskFiles = () => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log("taskFiles")
            resolve()
        }, 3000)
    });
}

const taskWatch = () => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log("taskWatch")
            resolve()
        }, 2000)
    });
}

const taskServer = () => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log("taskServer")
            resolve()
        }, 2000)
    });
}

const taskInit = async () => {
    console.log('START')
    // Ccnsecunses tasks
    // [clean => [javasctipt[css, html]] => watch => server]

    await taskClean()
    // await taskFiles()
    // await taskWatch()
    // await taskServer()

    console.log('FINISH')
}

taskInit()