const multer = require('multer')

//simply limits the filesize of images to 20mb. to prevent malicious requests
const upload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024,
  }
})

module.exports = upload