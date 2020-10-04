const express = require('express');
const UrlModel = require('../models/UrlModel');
const router = express.Router();
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const ErrorResponse = require('../utils/errorResponse');

router.get('/', (req, res) => {
  // Render the main page

  res.json(['😀', '😳', '🙄']);
});

router.post('/url', async (req, res, next) => {
  try {

    const original = req.body.original;
    const shortcut = req.body.shortcut || shortid.generate();

    if (!original) {
      return next(new ErrorResponse('الرجاء إرسال الرابط', 400));
    }

    if (await UrlModel.findById(shortcut)) {
      return next(new ErrorResponse('هذا الاختصار موجود من قبل', 400));
    }

    await UrlModel.create({
      _id: shortcut,
      originalUrl: original
    });


    let shortUrl = req.protocol + '://' + req.hostname;

    if (process.env.NODE_ENV == 'development') {
      shortUrl += ':' + process.env.PORT;
    }
    shortUrl += '/' + shortcut

    res.json({
      success: true,
      shortUrl
    });
  }
  catch (e) {
    console.log(e)
    if (e._message == 'Url validation failed') {
      return next(new ErrorResponse('الرجاء إرسال رابط صحيح', 400));
    }
    return next(new ErrorResponse('مشكلة في السيرفر', 500));
  }
});

router.get('/:shortcut', async (req, res, next) => {

  try {

    const shortcut = req.params.shortcut

    if (!shortcut) {
      return next(new ErrorResponse('الرجاء إرسال الإختصار', 400));
    }

    const url = await UrlModel.findById(shortcut)

    if (!url) {
      return next(new ErrorResponse('لا يوجد رابط بهذا الإختصار', 404));
    }

    res.redirect(url.originalUrl);
  }
  catch (e) {
    console.log(e)
    return next(new ErrorResponse(' مشكلة في السيرفر', 500));
  }

});

module.exports = router;
