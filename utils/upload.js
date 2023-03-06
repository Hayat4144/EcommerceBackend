const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'uploads/'
});
const limits = { fileSize: 1 * 1024 * 1024 }; // limit to 1 mb
const upload = multer({ storage })

module.exports = upload;