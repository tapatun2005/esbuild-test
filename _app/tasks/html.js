import { watch } from 'chokidar'
import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import glob from 'glob'

const location = './src/templates/**/*.html'
let script = ''

const template = async (file) => {
    // HTML tasks
    const templateStr = fs.readFileSync(path.resolve(file), 'utf8')
    const data = Handlebars.compile(templateStr)
    // Check for dist folder
    const dirName = path.dirname(`dist/${file.replace('src/templates/', '')}`)
    if(!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
    // End distFolder
    console.log(location)
    const isWritten = await fs.writeFileSync(path.join(`./dist/${file.replace('src/templates/', '')}`), data({script}))
}

const onLoad = () => {
    glob(location, {}, (er, files) => {
        files.forEach(file => {
          template(file)
        })
    })
}

const onChange = () => {
    const watcher = watch(location)
    watcher.on('all', (event, file) => {
        template(file)
    })
}

export const html = async (scriptPath) => {
    script = scriptPath
    await onLoad()
    await onChange()
}