const mongoose = require('mongoose');
const router = require('express').Router();
const Users = mongoose.model('users');
const Tokens = mongoose.model('accessTokens');

router.post('/', (req, res) => {
    let { body: { user } } = req;
    if (!user.email) {
        return res.status(422).json({
            email: 'is empty',
        })
    }

    if (!user.password) {
        return res.status(422).json({
            password: 'is empty',
        })
    }
    user.role = 'default';

    const finalUser = new Users(user);
    finalUser.setPassword(user.password);
    finalUser.displayName = 'Anime4nik^^';

    const userToken = new Tokens();
    console.log(finalUser._id);
    userToken.uid = finalUser._id;
    userToken.createAccessToken(finalUser);
    console.log(userToken.uid);

    //Maybe trouble with DB, I`ll check
    return finalUser.save()
        .then(() => userToken.save().then(() => {
            res.status(200).json({
                user: {
                    id: finalUser._id,
                    email: finalUser.email,
                    token: userToken.token
                }
            })
        }))
        .catch(() => {
            res.status(500).json({
                error: 'DB error'
            })
        })
})

module.exports = router;