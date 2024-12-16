const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const crypto=require("crypto");
const bcrypt=require("bcrypt");
//reset passwordToken
exports.resetPasswordToken=async(req,res)=>{
    try{
        //check user for mail and verify the it
    const email=req.body.email;
    const user=await User.findOne({email:email});
    if(!user){
        return res.json({sucess:false,
            message:'Your email is not registerd with us'
        });
    }
    //generate token
    const token=crypto.randomUUID();
    //update user by adding token and expiration time
    const updateDetails=await User.findOneAndUpdate(
                                {email:email},
                                {
                                    token:token,
                                    resetPasswordExpires: Date.now() + 5*60*1000, //5 minute
                                },
                                {new:true});
    // create url
    const url=`http://localhost:3000/update-password/${token}`
    //send mail containing the url
    await mailSender(email,
                    "Password Reset Link",
                    `Password Reser Link ${url}` 
    );
    // return response
    return res.json({
        sucess:true,
        message:'Email send sucessfully , please check you email and change password'
    });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:'Something went wrong while reseting the password'
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        //data fetch
      const { password, confirmPassword, token } = req.body
        //validate
      if (confirmPassword !== password) {
        return res.json({
          success: false,
          message: "Password and Confirm Password Does not Match",
        })
      }
      //get user deatil form the db using token
      const userDetails = await User.findOne({ token: token })
      //if no enty found means invalid token
      if (!userDetails) {
        return res.json({
          success: false,
          message: "Token is Invalid",
        })
      }
      //token time check(set to 5 minute in above code)
      if (!(userDetails.resetPasswordExpires > Date.now())) {
        return res.status(403).json({
          success: false,
          message: `Token is Expired, Please Regenerate Your Token`,
        })
      }
      //hash password
      const encryptedPassword = await bcrypt.hash(password, 10)
      // password updated
      await User.findOneAndUpdate(
        { token: token },
        { password: encryptedPassword },
        { new: true }
      )
      //return respose
      res.json({
        success: true,
        message: `Password Reset Successful`,
      })
    } catch (error) {
      return res.json({
        error: error.message,
        success: false,
        message: `Some Error in Updating the Password`,
      })
    }
  }