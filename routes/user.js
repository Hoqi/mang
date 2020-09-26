const router = require('express').Router();
const userService = require('../services/user');
const authService = require('../services/auth');
const {ErrorHandler} = require('../helpers/error');


router.post('/changename', authService.options ,async (req,res,next) => {
    try {
        const {user} = req;
        const {newName} = req.body;
        const result = await userService.changeName(user.id,newName);
        return res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
})


module.exports = router;