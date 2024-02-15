const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  sendToken(user, 200, res);
});

// Login User  =>  /api/v1/login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Please enter email & password",
      });
    }
    // Finding user in database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
      return;
    }

    let { token, options } = sendToken(user, 200, res);

    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Forgot Password   =>  /api/v1/password/update
exports.forgotPassword = async (req, res) => {
  try {
    const {oldPassword, password , email} = req.body
    console.log(req.body)
    if(!oldPassword || !password){
      return res.status(401).json({
        success: false,
        message: "Please enter old password & new password"
      })
    }
    let user = await User.findOne({email: email}).select("+password");
    console.log("user" , user)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found with this email",
      });
    }
    const isPasswordMatched = await user.comparePassword(oldPassword)
    console.log("isPasswordMatched" , isPasswordMatched)
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });

    }
     user.password = password;
     await user.save();
     return res.status(200).json({
      success: true,
      message: "Password changed successfully",
     })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
 
};

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
      res.status(404).json({
        success: false,
        message: "Old password is incorrect",
      });
      return;
    }

    user.password = req.body.password;
    await user.save();

     let tokenResponse = sendToken(user, 200, res);
     console.log("tokenResponse" , tokenResponse)
     res.status(200).json({
        success : true,
        token : tokenResponse?.token
     })

  } catch (error) {
    console.log("error" , error)
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  // Remove avatar from cloudinary
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
