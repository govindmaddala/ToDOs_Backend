require('dotenv').config('../.env');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    resetPasswordUser: String,
    resetPasswordExpire: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    } else {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.createToken = function () {
    return jwt.sign({ id: this._id },
        process.env.SECRET_MESSAGE,
        { expiresIn: process.env.TOKEN_EXPIRY_DATE });
};

userSchema.methods.comparePasswords = async function(passwordFromLoginPage){
    return await bcrypt.compare(passwordFromLoginPage,this.password);
}


module.exports = mongoose.model('user', userSchema);