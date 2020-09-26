const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const {handleError} = require('./helpers/error');


const app = express();

const port = 8080;

mongoose.connect('mongodb://localhost:27017/mang', { useNewUrlParser: true })
                                        .then(db => console.log('[OK] DB is connects'))
                                        .catch(err => console.log(err))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));



require('./models/user');
require('./models/accessToken');
require('./models/refreshToken');
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use((err,req,res,next) => {
    handleError(err,res);
});

app.listen(port,() => {
    console.log(`[OK] Server is running on port:${port}`);
})