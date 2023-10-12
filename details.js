const mongoose = require("mongoose");

const detailsSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    mailOTP: String,
    phoneOTP: String
});

module.exports = Details = mongoose.model('Details', detailsSchema);