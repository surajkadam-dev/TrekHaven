import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/error.js';
import {sendToken }from '../utils/jwtToken.js';
import { User } from '../models/User.model.js';

export const register = catchAsyncErrors(async (req, res) => {
  const { name, email, mobile, password, role, adminKey } = req.body;

  // Validate required fields
  if (!name || !email || !mobile || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email.' });
  }

  // Mobile number validation
  if (!/^[0-9]{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' });
  }

  // Admin key check
  if (role === 'admin' && adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ success: false, message: 'Invalid admin secret key.' });
  }

  // Existing user check
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email is already registered.' });
  }

  // Create user
  const user = await User.create({ name, email, mobile, password, role,isAdmin :role==="admin"});

  // Send JWT token in response
  sendToken(user, 201, res, 'User registered successfully');
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return res.status(400).json({
      success:false,
      error:"please provide role,email and password"
    })
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success:false,
      error:"invalid email or password"
    });
  }

  // Check if the password matches
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({
      success:false,
      error:"invalid password"
    })
  }

  // Check if the user's role matches the provided role
  if (user.role !== role) {
    return res.status(400).json({
      success:false,
      error:"Invalid user role"
    });
  }


    if (role === "admin" && !user.isAdmin) {
    return next(new ErrorHandler("Unauthorized access. You are not an admin.", 403));
  }

  sendToken(user, 200, res, "User login successfully");
});

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    sameSite: "none",
      secure: true,
      path: "/"
    });

    res.status(200).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUser=catchAsyncErrors(async (req,res,next)=>
{
  const user=req.user
  res.status(200).json(
    {
      success:true,
      user,
    }
  )
})

export const updatePassword=catchAsyncErrors(async(req,res,next)=>
{
  console.log(req.body)
  const user=await User.findById(req.user.id).select("+password")

  const isPasswordMatched=await user.comparePassword(req.body.oldPassword)
  console.log(user)
  console.log(isPasswordMatched)

  if(!isPasswordMatched)
  {
   // return next(new ErrorHandler("Old Password is incorrect",400))

   return res.status(400).json({
    success:false,
    status:400,
    error:"Old Password is incorrect"
   })

  }
  if(req.body.newPassword !== req.body.confirmPassword)
  {
   // return next(new ErrorHandler("New Password and confirm password do not match"),400)
   return res.status(400).json(
    {
      success:false,
      status:400,
      error:"New Password and confirm password do not match"
    }
   )
  }

  user.password=req.body.newPassword
  await user.save()

  sendToken(user,200,res,"password updated successfully")
})


export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, mobile } = req.body;

  // Validate request body - check for all required fields
  if (!name || !email || !mobile) {
   return res.status(400).json({
     success: false,
     status: 400,
     error: "Please provide all required fields"
   });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: "Please provide a valid email"
    });
  }

  // Validate mobile number format
  if (!/^[0-9]{10}$/.test(mobile)) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: "Enter a valid 10-digit mobile number"
    });
  }

  // Check if email is being changed to another user's email
  const existingUserWithEmail = await User.findOne({ 
    email,
    _id: { $ne: req.user.id } // Exclude current user
  });

  if (existingUserWithEmail) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: "Email is already in use"
    });
  }

  // Find and update user
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: "User not found"
    });
  }

  // Update only allowed fields
  user.name = name;
  user.email = email;
  user.mobile = mobile;

  // Save with validation
  await user.save({ validateBeforeSave: true });

  sendToken(user,200,res,"Profile updated successfully");
});