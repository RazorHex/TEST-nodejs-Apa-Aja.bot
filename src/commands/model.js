const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    server: Number,
    roles: [{
        name: String,
        description: String,
        id: Number
    }],
})

module.exports = mongoose.model('testing-role', schema)