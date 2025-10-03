import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../middleware/error.js';
import {sendToken }from '../utils/jwtToken.js';
import { User } from '../models/User.model.js';
import {OAuth2Client} from "google-auth-library"
import { sendEmail } from '../utils/emailService.js';
import crypto from "crypto";

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

  console.log(req.body);

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
 

  if(user.role !== role) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password or role"
    });
  }
<<<<<<< HEAD
=======

>>>>>>> f88c6a70b0d4726b99cbc688858e54267648d00e
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
if(user)
{
      if(user.isBlocked)
  {
    return res.status(400).json({
      success:false,
      error:"You are blocked please contact to admin"
    })
  }
}
<<<<<<< HEAD
 
=======

>>>>>>> f88c6a70b0d4726b99cbc688858e54267648d00e

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

  // Validate that at least one field is provided
  if (!name && !email && !mobile) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: "Please provide at least one field to update"
    });
  }

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: "User not found"
    });
  }

  // Validate email format if email is provided
  if (email && email !== user.email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        status: 400,
        error: "Please provide a valid email"
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

    user.email = email;
    user.lastUpdateEmail = Date.now();
  }

  // Validate mobile number format if mobile is provided
  if (mobile && mobile !== user.mobile) {
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        status: 400,
        error: "Enter a valid 10-digit mobile number"
      });
    }
    user.mobile = mobile;
    user.lastUpdateMobile = Date.now();
  }

  // Update name if provided
  if (name && name !== user.name) {
    user.name = name;
  }

  // Save with validation
  await user.save({ validateBeforeSave: true });

  sendToken(user, 200, res, "Profile updated successfully");
});

export const handleContactFormSubmit = async (req,res) => {
  const { name, email, phone, message } = req.body;



  try {
    await sendEmail({
      to: process.env.SENDER_EMAIL, // This will send the email to your business inbox
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

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  if (user.provider === "google") {
    return res.status(400).json({
      success: false,
      error: "This account is registered with Google. Please login using Google.",
    });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
await sendEmail({
  to: user.email,
  subject: "Reset Your Password - Karpewadi Homestay",
  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Karpewadi Homestay</title>
    <style>
      /* Reset Styles */
      body, html {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f8faf7;
      }
      
      /* Main Container */
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        border: 1px solid #e5ebe2;
      }
      
      /* Header */
      .header {
        background: linear-gradient(135deg, #389138 0%, #2a732a 100%);
        color: #ffffff;
        text-align: center;
        padding: 30px 0;
        position: relative;
      }
      
      .logo {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }
      
      .tagline {
        font-size: 14px;
        opacity: 0.9;
        font-weight: 300;
      }
      
      /* Content */
      .content {
        padding: 40px;
        color: #475a40;
      }
      
      .greeting {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 24px;
        color: #3a4934;
      }
      
      .message {
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 24px;
      }
      
      .instructions {
        background: #f8faf7;
        border-left: 4px solid #389138;
        padding: 20px;
        border-radius: 0 8px 8px 0;
        margin: 30px 0;
      }
      
      .instruction-list {
        margin: 0;
        padding-left: 20px;
      }
      
      .instruction-list li {
        margin-bottom: 12px;
        line-height: 1.6;
      }
      
      /* Button */
      .button-container {
        text-align: center;
        margin: 40px 0;
      }
      
      .button {
        display: inline-block;
        background: linear-gradient(135deg, #389138 0%, #2a732a 100%);
        color: #ffffff;
        padding: 16px 40px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(56, 145, 56, 0.3);
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }
      
      .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(56, 145, 56, 0.4);
      }
      
      /* Security Notice */
      .security-notice {
        background: #fffbf0;
        border: 1px solid #fde68a;
        border-radius: 8px;
        padding: 16px;
        margin: 30px 0;
        text-align: center;
      }
      
      .security-icon {
        color: #d97706;
        font-weight: bold;
        margin-right: 8px;
      }
      
      /* Footer */
      .footer {
        background: #f8faf7;
        padding: 30px 40px;
        text-align: center;
        border-top: 1px solid #e5ebe2;
      }
      
      .footer-text {
        font-size: 14px;
        color: #768f6d;
        line-height: 1.5;
      }
      
      .contact-info {
        margin-top: 20px;
        font-size: 14px;
        color: #5a7152;
      }
      
      .social-links {
        margin-top: 20px;
      }
      
      .social-link {
        color: #389138;
        text-decoration: none;
        margin: 0 10px;
        font-size: 14px;
      }
      
      /* Responsive */
      @media only screen and (max-width: 600px) {
        .content {
          padding: 30px 25px;
        }
        
        .header {
          padding: 25px 0;
        }
        
        .logo {
          font-size: 24px;
        }
        
        .button {
          padding: 14px 30px;
          font-size: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo">🌿 Karapewadi Homestay</div>
        <div class="tagline">Experience Nature's Embrace</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <div class="greeting">Hello ${user.name || 'Valued Guest'},</div>
        
        <div class="message">
          We received a request to reset your password for your Karapewadi Homestay account. 
          To ensure the security of your account, please follow the instructions below to create a new password.
        </div>
        
        <div class="instructions">
          <strong>Reset Instructions:</strong>
          <ol class="instruction-list">
            <li>Click the <strong>"Reset Password"</strong> button below</li>
            <li>Create a strong new password on the secure reset page</li>
            <li>Confirm your new password to complete the process</li>
            <li>You'll be automatically redirected to login with your new credentials</li>
          </ol>
        </div>
        
        <!-- Main Action Button -->
        <div class="button-container">
          <a href="${resetUrl}" class="button">Reset Your Password</a>
        </div>
        
        <!-- Security Notice -->
        <div class="security-notice">
          <span class="security-icon">🔒</span>
          <strong>Security Notice:</strong> This reset link will expire in <strong>2 Mintute</strong> for your protection. 
          If you didn't request this reset, please ignore this email or contact our support team immediately.
        </div>
        
        <div class="message">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #389138; word-break: break-all;">${resetUrl}</a>
        </div>
        
        <div class="message">
          Thank you for choosing Karapewadi Homestay. We look forward to welcoming you back!<br><br>
          Warm regards,<br>
          <strong>The Karapewadi Homestay Team</strong>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">
          This is an automated message. Please do not reply to this email.
        </div>
        
        <div class="contact-info">
          📍 Karapewadi Village, Maharashtra, India<br>
          📞 +91 XXXXXXXXXX | ✉️ surajkadam1706004@gmail.com
        </div>
        
        <div class="social-links">
          <a href="#" class="social-link">Website</a> • 
          <a href="#" class="social-link">Facebook</a> • 
          <a href="#" class="social-link">Instagram</a>
        </div>
        
        <div class="footer-text" style="margin-top: 20px; font-size: 12px; color: #9bb294;">
          © 2024 Karpewadi Homestay. All rights reserved.<br>
          Embracing nature, creating memories.
        </div>
      </div>
    </div>
  </body>
  </html>
  `,
});


    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}`,
    });
  } catch (err) {
    // Clear token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("ForgotPassword error:", err);
    return res.status(500).json({ success: false, error: "Email could not be sent" });
  }
});



export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ success: false, error: "Please provide all fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: "Passwords do not match" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, error: "Invalid or expired token" });
  }

  user.password = password; // triggers pre-save hashing
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
});

export const verifyResetToken=catchAsyncErrors(async(req,res,next)=>
{
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Token is invalid or expired",
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
})
