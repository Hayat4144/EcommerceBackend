const AsyncFunc = require("../../utils/AsyncFunc");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')
exports.ht = AsyncFunc(async (req, res, next) => {
    console.log(req.file)
    const { data } = req.body;
    console.log(JSON.parse(data))
    res.status(200).json(req.file)
})