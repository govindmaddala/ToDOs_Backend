const ErrorHandle = require('../utils/ErrorHandle');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 505;
    err.message = err.message || "Internal Error";
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}