const CatchAsyncErrors = (thisFun)=>{
    return (req,res,next)=>{
        Promise.resolve(thisFun(req,res,next)).catch(next)
    }
}
module.exports = CatchAsyncErrors;
