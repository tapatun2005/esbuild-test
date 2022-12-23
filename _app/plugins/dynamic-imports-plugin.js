import path from 'path'
import fs from 'fs'
import esbuild from 'esbuild'

// Helper
import { $hash } from './_helpers/hash.js'

const dynamicImportsPlugin = {
    name: 'dymanicImportsPlugin',
    setup({onLoad, onEnd, initialOptions}) {
        
        const hash = $hash(5)
        const options = initialOptions
        let imports = {}

        onLoad({ filter: /.*/}, async (args) => {
            let content = await fs.readFileSync(args.path, 'utf8')
            //Finds dynamic imports:
            if (content) { 
                const importRegex = /import\((.+?)\)/g
                const importStr = content.match(importRegex)
                if (importStr) {
                    const regexFolder = /\.(.*)\$/i
                    const folder = importStr[0].match(regexFolder)
                    if (folder) {
                        fs.readdirSync(`src/js/${folder[1]}`).forEach(filename => {
                            if (filename.indexOf('_') === -1) {
                                imports['.' + folder[1] + filename] = '.' + `/${hash}/` + filename
                            }
                        })

                        // TODO: Hard coded
                        content = content.replace('`./Components/${modules[name]}.js`', 'imports[`./Components/${modules[name]}.js`]')

                        content = `const imports = ${JSON.stringify(imports)};
                            ${content}
                        `

                        return {
                            contents: content
                        }
                    }
                } 
            }
        })

        onEnd(async () => {
            let {
                entryPoints,
                plugins,
                outdir,
                entryNames,
                chunkNames
            } = initialOptions

            entryPoints = Object.keys(imports).map(key => 'src/js/' + key.replace('./', ''))
            entryNames = `${hash}/[name]`
            outdir = outdir
            chunkNames = '[name]'
            plugins = []

            const options = {
                ...initialOptions,
                entryPoints,
                entryNames,
                outdir, 
                plugins
            }

            const output = await esbuild.build(options)
        })
    }
}

export default dynamicImportsPlugin