const router = require('express').Router();
const userService = require('../services/user');
const authService = require('../services/auth');
const {ErrorHandler} = require('../helpers/error');

router.post('/auth', authService.options, async (req, res) => {
    if (req.user) {
        throw new ErrorHandler(400,'err')
    }
    res.status(200).json('welcome');
})

router.post('/token', async (req, res, next) => {
    try {
        const user = req.body;
    if (authService.checkUserData(user)) {
        const tokens = await authService.authorization(user);
        res.status(200).json(tokens);  
    } else throw new ErrorHandler(406,'invalid login or password');
    } catch (err){
        next(err);
    }
    
})

router.post('/register', async (req, res, next) => {
    const { body: { user } } = req;
    if (!authService.checkUserData(user)) {
        try {
            const newUser = await userService.create(user);
            res.status(200).json(newUser);
        } catch (error) {
            res.status(409).json({ error: 'email already used'});
        }
    }
    res.status(422).json({
        error: 'invalid login or password',
    })
})

router.post('/refresh', async (req,res,next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Refresh'){
            const tokens = await authService.refresh(req.headers.authorization.split(' ')[1]);
            res.status(200).json(tokens);
        }
        else {
            throw new ErrorHandler(401, 'Where token?')
        }
    } catch (err) {
        next(err);
    }
})



module.exports = router;