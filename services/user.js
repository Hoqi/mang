const mongoose = require('mongoose');
const users = mongoose.model('users');
const avatar = require('../helpers/avatarConfig');
const {ErrorHandler} = require('../helpers/error');
const fs = require('fs');

const userService = {};

userService.findByEmail = async function (user){
    return await users.findOne({
        email: user.email
    }).exec();

}

userService.findById = async function (id) {
    return await users.findById(id).exec();
}

userService.create = async function (user){
    const newUser = new users({
        displayName: 'Anime4nik^^',
        email: user.email,
        role: 'default'
    })
    newUser.setPassword(user.password);
    return await newUser.save();
}

userService.changeAvatar = async function(id,name){
    let user = await this.findById(id);
    if (user.picture){
        fs.unlinkSync(avatar.Path + user.picture);
    }
    user.picture = name;
    const savedUser = await user.save();
    if (!savedUser){
        throw new ErrorHandler(500,'user save trouble');
    }
    return avatar.Path + user.picture;
}

userService.changeName = async function(id, newName) {
    const user = await this.findById(id);
    user.displayName = newName;
    await user.save();
    return user;
}

module.exports = userService;