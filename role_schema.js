const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    server: {
        type: Number,
        required: true
    },
    roles: [
        {
            name: String,
            description: String,
            id: Number
        }
    ]
})

module.exports = mongoose.model('role-test', schema, 'role-test')