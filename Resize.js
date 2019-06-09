const sharp = require('sharp')
const uuidv4 = require('uuid/v4')
const path = require('path')

// used to resize the images so they become faster to fetch for users
class Resize {
  constructor(folder) {
    this.folder = folder //filepath
  }
  
  // save function
  async save(buffer) {
    const filename = Resize.filename() // grabs filename
    const filepath = this.filepath(filename)

    await sharp(buffer)
      .resize({ width: 1024 }) //resize to 1024px width to reduce filesize
      .toFile(filepath) // saves the image to filepath
    
    return filename
  }
  static filename() {
    return `${uuidv4()}.png` //generates an unique filename
  }
  filepath(filename) { //"generates" filepath
    return path.resolve(`${this.folder}/${filename}`)
  }
}

module.exports = Resize