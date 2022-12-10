

const path = require('path')
const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, calback) => {
    const Acceptableextenstions = ['.png', '.jpg', '.jpeg'];
    const Bypassableextensions = ['.pht', 'phtml', '.php3', '.php4', '.php5', '.php6', '.inc', '.jspx', '.jspf', '.jsw', '.jsv', '\x00', '...']
    if (!(Acceptableextenstions.includes(path.extname(file.originalname)))) {
        calback(new Error('Only jpg, jpeg and png file is allowed.'))
    }
    if (Bypassableextensions.includes(file.originalname)) {
        calback(new Error('Only jpg, jpeg and png file is allowed.'))
    }
    calback(null, true)
}


const maxSize = 6 * 1024 * 1024; // for 1mb
const singalfileupload = multer({ storage, fileFilter, limits: { fileSize: maxSize } }).single('avtar');

module.exports = singalfileupload;