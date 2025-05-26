// import crypto from 'crypto';

// export const genrateOTP=()=>{
//     const otp= crypto.randomInt(100000,999999).toString()// genarate random number
//     const expiresAt=Date.now()+5*60*1000 //otp expires in 5 mins
// }

//Verification Otp 
export const GenrateVerificationOtp=async()=>{
    const Otp = String(Math.floor(100000 + Math.random() * 900000)); //random no for otp


    const ExpiresIn = Date.now() + 5 * 60 * 1000; //otpm time for 5 mins;
    return { Otp, ExpiresIn };
}


//Reset OTP Genrating function

export const GenarateRestOtp=async()=>{
    const resetOtp = String(Math.floor(100000 + Math.random() * 999999)); //random no for otp


        const resetOtpExpiresIn = Date.now() + 5 * 60 * 1000; //otpm time for 5 mins;
        return { resetOtp, resetOtpExpiresIn };

       
}
