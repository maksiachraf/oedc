const mongoose = require('mongoose')

const BrowserSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    privacy: {
        type: Number,
        required: true
    },
    visibility: {
        type: Number,
        required: true
    },
    maxusers: {
        type: Number,
        required: true
    },
    connusers: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    userList: {
        type: [],
        required: true
    },
    password: String
})

module.exports = mongoose.model('Browser', BrowserSchema)