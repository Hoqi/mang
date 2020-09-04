const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');


const app = express();

const port = 8080;

mongoose.connect('mongodb://localhost:27017/mang', { useNewUrlParser: true })
                                        .then(db => console.log('[OK] DB is connects'))
                                        .catch(err => console.log(err))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

require('./models/user');
require('./models/token');
app.use('/auth', require('./routes/auth/auth'));

app.listen(port,() => {
    console.log(`[OK] Server is running on port:${port}`);
})