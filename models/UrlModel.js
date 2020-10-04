const mongoose = require('mongoose');
const shortid = require('shortid');

require('mongoose-type-url');



const UrlSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    originalUrl: {
        type: mongoose.SchemaTypes.Url, required: true
    }
});


module.exports = mongoose.model('Url', UrlSchema);

