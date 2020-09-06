const router = require('express').Router();
const userService = require('../services/user')
const authService = require('../services/auth')
const jwt = require('express-jwt')

router.post('/auth', authService.options,(req,res) =>{
    return  res.status(200).json('rabotaet');
})

router.post('/token',(req,res) => {
    const {body: {user}} = req;
    if(authService.checkUserData(user)){
        authService.authorization(user).then(value => {
            return  res.status(200).json(value)
        }, reason => {return res.status(400).json({error: reason})})
    } else return res.status(415).json({error: 'invalid user data'});
})

router.post('/register', (req,res) => {
    const {body: {user}} = req;
    console.log(user);
    if(!authService.checkUserData(user)){
        return res.status(422).json({
            error: 'invalid login or password',
        })
    }
    userService.create(user).then((newUser) => {
        res.status(200).json(newUser);
    },reason => res.status(405).json({error: 'email already used'}));

    /*if(await userService.create(user)){
        return res.status(200).json({
            status:'success'
        })
    } else return res.status(400).send();*/
})




module.exports = router;