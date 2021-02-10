const mongoose = require('mongoose')

let Schema = mongoose.Schema

let playerSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: false
    }
})

module.exports = mongoose.model('players', playerSchema)