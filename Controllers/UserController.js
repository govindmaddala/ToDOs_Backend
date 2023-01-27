const User = require('../Database/UserSchema');
const CatchAsyncErrors = require('../utils/CatchAsyncErrors');
const CreateAndSendToken = require('../utils/CreateAndSendToken');
const ErrorHandle = require('../utils/ErrorHandle');

const createUser = CatchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
        return next(new ErrorHandle("User already existed", 400));
    }
    const newUser = await User.create(req.body);
    req.user = newUser;
    CreateAndSendToken(newUser, 200, res);
});

const getUserByID = CatchAsyncErrors(async (req, res, next) => {
    const userFound = await User.findById(req.params.id);
    if (userFound) {
        return res.status(200).json({
            message:"Our user",
            username:userFound.username,
            success:true
        })
    }else{
        return next(new ErrorHandle("User not found", 404));
    }
});

const loginUser = CatchAsyncErrors(async(req,res,next)=>{
    const { email,password } = req.body;
    const userFound = await User.findOne({ email }).select('+password');
    if(!userFound){
        return next(new ErrorHandle("User not found", 400));
    }
    const passwordsMatched = await userFound.comparePasswords(password);
    if(!passwordsMatched){
        return next(new ErrorHandle("Invalid email or password", 403));
    }else{
        req.user = userFound;
        CreateAndSendToken(userFound, 200, res);
    }
});

const logoutUser = CatchAsyncErrors(async (req, res, next) => {
    const { userID } = req.body;
    const userFound = await User.findById(userID);
    if (userFound) {
        return res.status(200).cookie('AUTH_TOKEN', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({
            success:true,
            message:`${userFound.username} logged out successfully`
        })

    } else {
        return next(new ErrorHandle("Internal error", 500));
    }
});

module.exports = { createUser,loginUser,getUserByID,logoutUser };