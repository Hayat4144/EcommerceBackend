const express = require('express');
// const upload = require('../../../utils/upload');
const { CreateBanner } = require('../api/CreateBanner');
const { ReadBanner } = require('../api/ReadBanner');
const { UpdateBanner } = require('../api/UpdateBanner');
const BannerRouter = express.Router();


// BannerRouter.post('/v4/api/create/banner', upload.single('banner_image'), CreateBanner)
BannerRouter.get('/v4/api/read/banner', ReadBanner)
BannerRouter.post('/v4/api/update/banner', UpdateBanner)

module.exports = BannerRouter;