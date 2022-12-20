const AsyncFunc = require("../../utils/AsyncFunc");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier')
exports.ht = AsyncFunc(async (req, res, next) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream({ folder: "test" }, function (error, result) {
        console.log(error, result);
        res.json({ public_id: result.public_id, url: result.secure_url });
    });

    streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
})