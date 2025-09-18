export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
   const { _id, name, email, role, isAdmin, avatar, provider, createdAt, mobile } = user;

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite:"none",
      secure:true,
    path: "/",
  
    
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      user: { _id, name, email, role, isAdmin, avatar, provider, createdAt, mobile },
      message,
      token
    });
};
