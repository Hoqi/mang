const mongoose = require('mongoose');
const users = mongoose.model('users');


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

userService.changeName = async function(id, newName) {
    const user = await this.findById(id);
    user.displayName = newName;
    await user.save();
    return user;
}

module.exports = userService;