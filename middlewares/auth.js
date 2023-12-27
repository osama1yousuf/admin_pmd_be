const User = require('../models/user')

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
        res.status(401).json({
            success : false,
            message : 'Login first to access this resource.'
        })
        return 
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    
    next()
  } catch (error) {
    console.log("error" , error)
    res.status(500).json({
        success : false,
        message : 'server error'
    })
  }
    
}

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}