const mongoose = require('mongoose');
const accessTokens = mongoose.model('accessTokens');
const refreshTokens = mongoose.model('refreshTokens');
const userService = require('./user')
const config = require('../config/config')
const jwt = require('express-jwt');
const {ErrorHandler} = require('../helpers/error');

const Auth = {}


Auth.options = jwt({
    algorithms: ['HS256'],
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
})

Auth.checkUserData = function (user) {
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
    await newRefreshToken.save();
    await newAccessToken.save();
    result.refreshToken = newRefreshToken.token;
    result.accessToken = newAccessToken.token;
    return result;
}

Auth.authorization = async function (user) {
    const userDb = await userService.findByEmail(user);
    if (userDb && userDb.comparePassword(user.password)) {
        await this.deleteAccessToken(userDb._id)
        const result = await this.getTokenPair(userDb);
        return result;
    } 
    else {
        throw new ErrorHandler(406,'invalid login or password');
    }
}


Auth.deleteAccessToken = async function (uid) {
    await accessTokens.deleteOne({
        uid: uid
    }).exec();
}

Auth.refresh = async function (refreshToken) {
    const fToken = await refreshTokens.findOneAndDelete({ token: refreshToken});
    if (!fToken) 
        throw new ErrorHandler(406,'invalid refresh token');
    await accessTokens.deleteOne({ uid: fToken.uid})
    return this.getTokenPair({ _id: fToken.uid});
    
}


module.exports = Auth;