import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing
import jwt from "jsonwebtoken"; // Import jsonwebtoken for JWT token creation
import userModel from "../models/userModel.js"; // Import user model
import transporter from "../config/nodemailer.js";

// Register new user
export const register = async (req, res) => {
  const { name, email, password } = req.body; // Extract name, email, password from request body
  if (!name || !email || !password) {
    // Return error if any field is missing
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    // Check if user with given email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash the password with salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance with hashed password
    const user = new userModel({ name, email, password: hashedPassword });

    // Save user to database
    await user.save();

    // Generate JWT token with user ID and secret, expires in 7 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token as HTTP-only cookie with security options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

//sending welcom email

const mailOptions={
    // ISSUE: The from email domain must be verified in your MailerSend account to send emails successfully.
    // Please ensure the domain of the email address set in process.env.SENDER_EMAIL is verified in MailerSend.
    from:process.env.SENDER_EMAIL,
    to:email,
    subject:'Welcome to Abhay Tech',
    text:`Welcome to Abhay Tech Website. Your account has been created wtih this email id:${email}`
}

await transporter.sendMail(mailOptions);

    return res.json({ success: true });
 
} catch (error) {
    // Return error message on failure
    res.json({ success: false, message: error.message });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  if (!email || !password) {
    // Return error if email or password is missing
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "invalid email" });
    }
    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    // Generate JWT token with user ID and secret, expires in 7 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token as HTTP-only cookie with security options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.json({ success: true });
  } catch (error) {
    // Return error message on failure
    return res.json({ success: false, message: error.message });
  }
};

// User logout
export const logout = async (req, res) => {
  try {
    // Clear the token cookie to log out the user
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    // Return error message on failure
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp=async(req,res)=>{
    try {
        const {userId}=req.body;
        const user=await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false,message:"Account Already Verified"})
        }
       const otp=String (Math.floor(100000+ Math.random()*900000));


       user.verifyOtp=otp;
       user.verifyOtpExpireAt=Date.now()+24*60*60*1000;


       await user.save();


       const mailOptions={
        // ISSUE: The from email domain must be verified in your MailerSend account to send emails successfully.
        // Please ensure the domain of the email address set in process.env.SENDER_EMAIL is verified in MailerSend.
        from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:'Account Verification OTP',
    text:`Your OTP is ${otp}. Verify your account using this OTP`
       }

       await transporter.sendMail(mailOptions);

       res.json({success:true,message:'Verification OTP sent on mail'})



    } catch (error) {
        res.json({success:false,message:error.message});
    }
}




export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;
    if(!userId || !otp){
        return res.json({success:false,message:"Missing Details"});
    }
    try {
         const user=await userModel.findById(userId);
         if(!user){
            return res.json({success:false,message:"User Not Found"})
         }

         if(user.verifyOtp===''||user.verifyOtp!=otp){
            return res.json({success:false,message:'invalid OTP'});
         }

         if(user.verifyOtpExpireAt<Date.now()){
             return res.json({success:false,message:'OTP Expired'});
         }

         user.isAccountVerified=true;
         user.verifyOtp='';
         user.verifyOtpExpireAt=0;
         await user.save();
         return res.json({success:true,message:'Email Verified Successfully'})

    } catch (error) {
         return res.json({success:false,message:error.message});
    }

}


export const isAuthenticated=async(req,res)=>{

  try {
    return res.json({success:true});
  } catch (error) {
    res.json({success:false,message:error.message});
  }
}

//send password reset otp

export const sendResetOtp=async(req,res)=>{

  const {email}=req.body;
  if(!email){
    return res.json({success:false,message:"email is requried"})
  }
  try {
    const user=await userModel.findOne({email});
    if(!user){
      return res.json({success:false,message:'User Not found'})
    }

    const otp=String (Math.floor(100000+ Math.random()*900000));


       user.resetOtp=otp;
       user.resetOtpExpireAt=Date.now()+15*60*60*1000;


       await user.save();


       const mailOptions={
        // ISSUE: The from email domain must be verified in your MailerSend account to send emails successfully.
        // Please ensure the domain of the email address set in process.env.SENDER_EMAIL is verified in MailerSend.
        from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:'Password Reset OTP',
    text:`Your OTP for resetting your password is ${otp}. use this otp to proceed with resetting your password`
       }

       await transporter.sendMail(mailOptions);
       return res.json({success:true,message:'OTP sent to your email'});
    
  } catch (error) {
    return res.json({success:false,message:error.message})
  }
}

//Reset user Password

export const resetPassword=async (req,res)=>{

  const {email,otp,newPassword}=req.body;
  if(!email ||!otp ||!newPassword){
    return res.json({success:false,message:'Email,otp,and new password are requried'});

  }
  try {

    const user=await userModel.findOne({email});
    if(!user){
      return res.json({success:false,message:'user not found'});

    }

    if(user.resetOtp===''||user.resetOtp!=otp){
      return res.json({success:false,message:'Invalid otp'});
    }

    if(user.resetOtpExpireAt<Date.now()){
      return res.json({success:false,message:'otp expired'});
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    user.resetOtp='';
    user.resetOtpExpireAt=0;
    await user.save();


    return res.json({success:true,message:'Password has been reset successfully '});
    
  } catch (error) {
    return res.json({success:false,message:error.message});

  }
}

