import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/error.js';
import {sendToken }from '../utils/jwtToken.js';
import { User } from '../models/User.model.js';
import {OAuth2Client} from "google-auth-library"
import { sendEmail } from '../utils/emailService.js';

import {config} from "dotenv"
config({
  path:"./config/config.env"
});
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET);
export const register = catchAsyncErrors(async (req, res) => {
  const { name, email, mobile, password, role, adminKey } = req.body;

  // Validate required fields
  if (!name || !email || !mobile || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Email format validation
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

  // Check if email already exists (manual or Google)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email is already registered. Please login.'
    });
  }

  // Check if mobile number already exists
  

  // Create new manual user
  const user = await User.create({ 
    name, 
    email, 
    mobile, 
    password, 
    role, 
    isAdmin: role === "admin",
    provider: 'local'
  });

  // Send JWT token
  sendToken(user, 201, res, 'User registered successfully');
   await sendEmail({
  to: email,   // new user email
  subject: "करपेवाईडी होम स्टे मध्ये आपले स्वागत आहे 👋 – नोंदणी यशस्वी",
  html: `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" 
                 style="max-width:600px;background:#ffffff;border-radius:8px;
                 overflow:hidden;box-shadow:0 6px 18px rgba(20,20,20,0.08);">

            <!-- content -->
            <tr>
              <td style="padding:32px 36px;font-family:Arial, Helvetica, sans-serif;color:#0f1724;text-align:center;">
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#0b2545;">
                  करपेवाईडी होम स्टे मध्ये आपले स्वागत आहे 👋
                </h1>
                <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563;">
                  नमस्कार <strong>${email}</strong>,<br><br>
                  आम्हाला आनंद आहे की आपण आमच्या होम स्टे आणि जेवण सेवेसाठी नोंदणी केली आहे! 🎉  
                  तुमची नोंदणी यशस्वीरीत्या पूर्ण झाली आहे.  
                </p>
                <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563;">
                  आपल्या मुक्कामादरम्यान आम्ही आपल्याला आरामदायक मुक्काम आणि स्वादिष्ट जेवण अनुभव देऊ.  
                  कोणत्याही बदलांसाठी किंवा प्रश्नांसाठी आम्हाला संपर्क साधा.  
                </p>

                <p style="margin:32px 0 0;font-size:14px;color:#0f1724;font-weight:600;">
                  शुभेच्छा,<br>Team करपेवाईडी होम स्टे
                </p>

                <p style="margin-top:30px;font-size:12px;color:#9aa3b2;">
                  हे स्वयंचलित सूचना ईमेल आहे. कृपया उत्तर देऊ नका.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
});
});

export const checkMobile = async (req, res) => {
  try {
    const { number } = req.query;

    if (!number || !/^\d{10}$/.test(number)) {
      return res.status(400).json({ message: "वैध 10-अंकी मोबाइल नंबर द्या" });
    }

    const user = await User.findOne({ mobile: number });

    if (user) {
      return res.json({ available: false, message: "मोबाइल आधीपासून नोंदणीकृत आहे" });
    } else {
      return res.json({ available: true, message: "मोबाइल वापरण्यास उपलब्ध आहे" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ available: false, message: "सर्व्हर त्रुटी" });
  }
};

export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;

  // Validate input
  if (!role || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide role, email and password"
    });
  }

  // Find user by email and provider 'local' only
  const user = await User.findOne({ email, provider: 'local' }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password or role"
    });
  }

  // Check password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password or role"
    });
  }

  // Check role
 


  // Admin check
  if (role === "admin" && !user.isAdmin) {
    return next(new ErrorHandler("Unauthorized access. You are not an admin.", 403));
  }

  if(user.isBlocked)
  {
    return res.status(400).json({
      success:false,
      error:"You are blocked please contact to admin"
    })
  }

  // Send JWT
  sendToken(user, 200, res, "User login successfully");
});



export const googleAuth = catchAsyncErrors(async (req, res, next) => {
  const { idToken } = req.body;
 
   
  if (!idToken) {
    return res.status(400).json({ success: false, error: "Please provide Google ID token" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ success: false, error: "Google account does not have an email" });
    }

    // Check if user exists by googleId ONLY
    let user = await User.findOne({ googleId});
    if(user.isBlocked)
  {
    return res.status(400).json({
      success:false,
      error:"You are blocked please contact to admin"
    })
  }
  if(user.provider!== "google")
  {
     return res.status(400).json({
      success:false,
      error:"You are register in manualy please login with email and paasword "
    })
  }

    if (user) {
      // Existing Google user → login
      sendToken(user, 200, res, "User logged in successfully with Google");
    } else {
      // Create new Google user regardless of email
      const newUser = await User.create({
        name,
        email,
        provider: "google",
        googleId,
        avatar: picture || null,
        role: "trekker",
        isAdmin: false,
      });

      sendToken(newUser, 201, res, "User registered successfully with Google");
       await sendEmail({
  to: email,   // new user email
  subject: "करपेवाईडी होम स्टे मध्ये आपले स्वागत आहे 👋 – नोंदणी यशस्वी",
  html: `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" 
                 style="max-width:600px;background:#ffffff;border-radius:8px;
                 overflow:hidden;box-shadow:0 6px 18px rgba(20,20,20,0.08);">

            <!-- content -->
            <tr>
              <td style="padding:32px 36px;font-family:Arial, Helvetica, sans-serif;color:#0f1724;text-align:center;">
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#0b2545;">
                  करपेवाईडी होम स्टे मध्ये आपले स्वागत आहे 👋
                </h1>
                <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563;">
                  नमस्कार <strong>${email}</strong>,<br><br>
                  आम्हाला आनंद आहे की आपण आमच्या होम स्टे आणि जेवण सेवेसाठी नोंदणी केली आहे! 🎉  
                  तुमची नोंदणी यशस्वीरीत्या पूर्ण झाली आहे.  
                </p>
                <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#4b5563;">
                  आपल्या मुक्कामादरम्यान आम्ही आपल्याला आरामदायक मुक्काम आणि स्वादिष्ट जेवण अनुभव देऊ.  
                  कोणत्याही बदलांसाठी किंवा प्रश्नांसाठी आम्हाला संपर्क साधा.  
                </p>

                <p style="margin:32px 0 0;font-size:14px;color:#0f1724;font-weight:600;">
                  शुभेच्छा,<br>Team करपेवाईडी होम स्टे
                </p>

                <p style="margin-top:30px;font-size:12px;color:#9aa3b2;">
                  हे स्वयंचलित सूचना ईमेल आहे. कृपया उत्तर देऊ नका.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
});
    }
  } catch (err) {
    console.error("googleAuth error:", err);
    return res.status(401).json({ success: false, error: "You are not regiter with google" });
  }
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
  console.log("id", req.user._id);
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

export const handleContactFormSubmit = async (req,res) => {
  const { name, email, phone, message } = req.body;



  try {
    await sendEmail({
      to: process.env.SMTP_MAIL, // This will send the email to your business inbox
      subject: `New Contact Form Submission from ${name}`,
      text: `
You have received a new inquiry from your Contact Us page.

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color:#4b5320;">New Contact Form Submission</h2>
          <p>You have received a new inquiry from your Contact Us page.</p>
          <table cellpadding="6" style="border-collapse: collapse;">
            <tr>
              <td style="font-weight:bold;">Name:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;">Email:</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;">Phone:</td>
              <td>${phone}</td>
            </tr>
            <tr>
              <td style="font-weight:bold; vertical-align: top;">Message:</td>
              <td>${message}</td>
            </tr>
          </table>
          <br/>
          <p style="color:#777;font-size:12px;">This email was generated from the contact form on your website.</p>
        </div>
      `
    });

    return res.status(200).json(({
      success:true,
      message:"Contact form email sent successfully!"
    }))

  } catch (error) {
    console.log(error);
      return res.status(400).json(({
      success:false,
      message:"Failed to send contact form email:"
    }))
  }
};




