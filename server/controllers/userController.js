
import UserModel from "../models/userModel.js";

export const getUserDetails=async(req,res)=>{
    const {userId}=req.body;

    if(!userId){
       return res.json({success:false,message:"User is unathorized, please signIn again"});
    }
    try {
        const user=await UserModel.findById(userId);

        if(!user){
           return res.json({success:false,message:"User not found"});
        }
        
      return  res.json({UserDetails:{user},success:true,message:"User Details Fetched successfully"})
        
    } catch (error) {
        return  res,json({success:false,message:"User Not found"})
    }    
}