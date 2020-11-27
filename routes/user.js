const router = require('express').Router();
const userService = require('../services/user');
const authService = require('../services/auth');
const {ErrorHandler} = require('../helpers/error');
const avatar = require('../helpers/avatarConfig');
const path = require('path');
const uuid = require('uuid')


router.post('/change/name', authService.options ,async (req,res,next) => {
    try {
        const {user} = req;
        const {newName} = req.body;
        const result = await userService.changeName(user.id,newName);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
})

router.post('/change/picture',authService.options, async (req,res,next) => {
    try {
        const user = req.user;
        const pic = req.files.photo;
        const ext = pic.name.split('.').pop();
        pic.name = uuid.v4() + '.' + ext;
        if (!avatar.mimetypes.includes(pic.mimetype) || !avatar.ext.includes(ext))
            throw new ErrorHandler(415, 'Type error');
        if (avatar.limit < pic.size)
            throw new ErrorHandler(413, 'Too large');
        await pic.mv(avatar.Path + pic.name);
        const pic_url = await userService.changeAvatar(user.id,pic.name);
        res.status(200).json({
            picture: pic_url,
        })
    } catch (err) {
        next(err);
    }
})

router.get('/picture/:path', async (req,res,next) => {
    try {
       const filename = req.params.path;
       res.sendFile(path.resolve(__dirname + '/../' + avatar.Path + filename));
    } catch (err) {
        next(err);
    }
})

module.exports = router;