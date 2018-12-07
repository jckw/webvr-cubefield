import { FontLoader } from 'three'

export default (fontFile) => new Promise((resolve, reject) => {
    const loader = new FontLoader()

    loader.load(fontFile, function(response) {
        resolve(response)
    })
})
