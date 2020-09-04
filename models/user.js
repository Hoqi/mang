const mongose = require('mongoose');
const { Schema } = require('mongoose')
const crypto = require('crypto');

const UserSchema = new Schema({
    displayName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        requiredPaths: true
    },
    role: {
        type: String,
        required: true
    }
})

UserSchema.methods.setPassword = function(password){
    this.password = crypto.createHash('sha256').update(password).digest('hex');
}

UserSchema.methods.comparePassword = function(password){
    return this.password == crypto.createHash('sha256').update(password).digest('hex');
}



module.exports = mongose.model('users', UserSchema)
