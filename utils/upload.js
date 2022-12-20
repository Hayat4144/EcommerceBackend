const multer = require('multer')
const storage = multer.memoryStorage();
const limits = { fileSize: 1000 * 1000 * 1 }; // limit to 4mb
const upload = multer({ storage })

module.exports = upload;