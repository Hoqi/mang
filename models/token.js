const mongose = require('mongoose');
const { Schema } = require('mongoose')
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
    }
})


AccessTokenSchema.methods.createAccessToken = function(user){
    this.token = jwt.sign({
        id: user._id,
        ttl: parseInt(new Date().getTime() / 1000 , 10) + 60*30,
        role: user.role
    },"secret");
}

module.exports = mongose.model('accessTokens',AccessTokenSchema);