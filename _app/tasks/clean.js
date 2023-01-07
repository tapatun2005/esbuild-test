// App configs
import CONFIGS from '../../config.js'

// Packages
import fs from 'fs'

export const taskClean = () => {
    const arr = []
    const deleteFolder = (folderPath) => {
        return new Promise((resolve,reject) => {
            // Checks if folder exists
            fs.access(folderPath, (err) => {
                if (err) {
                    console.log(`Folder: '${folderPath}' doesn't exist`)
                    resolve()
                } else {
                    // Removes existing folder
                    fs.rm(folderPath, { recursive: true }, () => {
                        console.log(`Folder: '${folderPath}' is removed`)
                        resolve()
                    })
                }
            })
        })
    }
    if (typeof CONFIGS.clean === 'string') {
        arr.push(deleteFolder(CONFIGS.clean))
    } else {
        CONFIGS.clean.forEach(folder => arr.push(deleteFolder(folder)))
    }
    return Promise.all(arr)
}