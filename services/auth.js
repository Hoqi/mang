const mongoose = require('mongoose');
const accessTokens = mongoose.model('accessTokens');
const refreshTokens = mongoose.model('refreshTokens');
const userService = require('./user')
const config = require('../config/config')
const jwt = require('express-jwt');

let Auth = {}

Auth.options = jwt({
    algorithms: ['HS256'],
    secret: config.secret,
})

Auth.checkUserData = function(user) {
    return (user.email !== '' && user.password !== '')
}

Auth.getTokenPair = async function (user) {
    let newAccessToken = new accessTokens({
        uid: user._id,
    });
    newAccessToken.createToken(user);
    const newRefreshToken = new refreshTokens({
        uid: user._id,
    })
    newRefreshToken.createToken();
    let result = {};
    console.log('eblan4')
    await newRefreshToken.save();
    console.log('eblan5')
    await newAccessToken.save();
    console.log('eblan6')
    result.refreshToken = newRefreshToken.token;
    result.accessToken = newAccessToken.token;
    console.log(result);
    return result;
}

Auth.authorization = async function (user){
    const userDb = await userService.findByEmail(user);
    if (userDb && userDb.comparePassword(user.password)){
        console.log('eblan1');
        await this.deleteAccessToken(userDb._id)
        console.log('eblan2');
        const result = await this.getTokenPair(userDb);
        console.log('eblan');
        return result;
    } else {
        console.log('a');
        return null;}
}


Auth.deleteAccessToken = async function(uid){
    await accessTokens.deleteOne({
        uid: uid
    }).exec();
}

Auth.refresh = function (refreshToken){
    refreshTokens.findOne({
        token: refreshToken
    }, (err,doc) => {
        if (err) return null;
        if (doc){
            this.deleteAccessToken(doc.uid).then((res) => {
                refreshTokens.deleteOne({
                    token: doc.token
                },(err,res) => {
                    if (err) return null;
                    return this.getTokenPair({_id:doc.uid})
                })
            })
        }
    })
}


module.exports = Auth;