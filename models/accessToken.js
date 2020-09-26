const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const AccessTokenSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
})


AccessTokenSchema.methods.createToken = function(user){
    this.token = jwt.sign({
        id: user._id,
       // exp: parseInt( new Date().getTime() / 1000 , 10) + 60*100,
        role: user.role
    },config.secret);
    console.log('A token: ' + this.token);
}

module.exports = mongoose.model('accessTokens',AccessTokenSchema);