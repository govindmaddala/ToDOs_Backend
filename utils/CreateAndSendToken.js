require('dotenv').config('../Config/.env');
const CreateAndSendToken = (user,statusCode,res)=>{
    const token = user.createToken();
    const options = {
        expires:new Date(Date.now() + process.env.TOKEN_EXPIRY_TIME*24*60*60*1000),
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
    }
    return res.status(statusCode).cookie('AUTH_TOKEN',token,options).json({
        success:true,
        message:token
    })
}

module.exports = CreateAndSendToken;