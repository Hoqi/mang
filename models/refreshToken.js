const mongoose = require('mongoose');
const { Schema } = mongoose
const uuid = require('uuid')


const RefreshTokenSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
})


RefreshTokenSchema.methods.createToken = function(){
    this.token = uuid.v4();
}

module.exports = mongoose.model('refreshTokens',RefreshTokenSchema);