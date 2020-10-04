const express = require('express');
const UrlModel = require('../models/UrlModel');
const router = express.Router();
const nanoid = require('nanoid').nanoid;
const ErrorResponse = require('../utils/errorResponse');

router.get('/', (req, res) => {
  // Render the main page

  res.json(['😀', '😳', '🙄']);
});

router.post('/url', async (req, res, next) => {
  try {

    const original = req.body.original;
    const slug = req.body.slug || nanoid(3);

    if (!original) {
      return next(new ErrorResponse('الرجاء إرسال الرابط', 400));
    }

    if (slug.length > 24) {
      return next(new ErrorResponse('لا يمكن ان يحتوي الإختصار على اكثر من 24 حرف', 400));
    }

    if (await UrlModel.findById(slug)) {
      return next(new ErrorResponse('هذا الاختصار موجود من قبل', 400));
    }

    await UrlModel.create({
      _id: slug,
      originalUrl: original
    });


    let shortUrl = req.protocol + '://' + req.hostname;

    if (process.env.NODE_ENV == 'development') {
      shortUrl += ':' + process.env.PORT;
    }
    shortUrl += '/' + slug

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

router.get('/:slug', async (req, res, next) => {

  try {

    const slug = req.params.slug

    if (!slug) {
      return next(new ErrorResponse('الرجاء إرسال الإختصار', 400));
    }

    const url = await UrlModel.findById(slug)

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
