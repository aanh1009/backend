const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    }
})

const User = new moongoose.model('User', userSchema)
module.exports = User