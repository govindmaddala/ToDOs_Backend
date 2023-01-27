require('dotenv').config('../.env');
const CatchAsyncErrors = require("../utils/CatchAsyncErrors");
const ErrorHandle = require('../utils/ErrorHandle');
const jwt = require('jsonwebtoken');
const User = require('../Database/UserSchema')

const isLogged = CatchAsyncErrors(async(req,res,next)=>{
    console.log(req.cookie);
    if (!token) {
        return next(new ErrorHandle('Please Login', 401))
    }
    const decodedData = jwt.verify(token, process.env.SECRET_MESSAGE);
    req.user = await User.findById(decodedData.id)
    // console.log(req.user);
    console.log(decodedData);
    next();
})

module.exports = isLogged;