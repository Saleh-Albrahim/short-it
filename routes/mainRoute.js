const express = require('express');
const UrlModel = require('../models/UrlModel');
const router = express.Router();
const shortid = require('shortid');
const ErrorResponse = require('../utils/errorResponse');

router.get('/', (req, res) => {
  // Render the main page

  res.json(['😀', '😳', '🙄']);
});

router.post('/url', async (req, res) => {
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
  }
});

router.get('/:shortcut', (req, res) => {

  // TODO: redirect to the original url

  res.json(['😀', '😳', '🙄']);
});

module.exports = router;
