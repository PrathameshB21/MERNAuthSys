import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js';
import transporter from "../Config/nodeMailer.js";
import { configDotenv } from "dotenv";
import { GenrateVerificationOtp, GenarateRestOtp } from "../Config/genrateOTP.js";


// import nodemailer from 'nodemailer';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exist" })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);


        const user = new UserModel({
            name, email, password: hashedPassword
        })
        await user.save();



        const token = jwt.sign({ id: user._id }, process.env.jwtSecret, { expiresIn: '7d' });


        res.cookie('token', token, {
            httpOnly: true, // The cookie cannot be accessed via JavaScript (for security purposes)
            secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // To handle cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time (7 days)
        })


        const mailOptions = {
            from: process.env.Sender_Email,
            to: email,
            subject: 'welcome',
            text: `welcome , you are seeing this mail cause you successfully register with email ${email}`
        }


        if (transporter) {
            await transporter.sendMail(mailOptions);


        } else {
            return res.json({ success: false, message: "Unable to send mail" })
        }

        return res.json({
            success:true,
            message: "User registered successfully",
            token: token // Sending the token in the response body as well, if needed
        });


    } catch (error) {
        return res.json({ success: false, message: "Error While regestring User" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email, !password) {
        res.json({ success: false, message: "all fields are required" })
    }

    try {
        const userExist = await UserModel.findOne({ email });
        if (!userExist) {
            res.json({ success: false, message: "no user registerd with this email" })
        }
        const isPassMatch = await bcrypt.compare(password, userExist.password);

        if (!isPassMatch) {
            res.json({ success: false, message: "invalid password" })
        }
        const token = jwt.sign({ id: userExist._id }, process.env.jwtSecret, { expiresIn: '7d' });
        // 

        return res.cookie('token', token, {
            httpOnly: true, // The cookie cannot be accessed via JavaScript (for security purposes)
            secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // To handle cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time (7 days)
        }).json({
            success: true,
            message: "User loggedIn successfully",
            token: token // Sending the token in the response body as well, if needed
        });


    }
    catch (error) {
        res.json({ success: false, message: "Error While loggin" })
    }
}

export const logout = async (req, res) => {
    try {
        return res.clearCookie('token', {
            httpOnly: true, // The cookie cannot be accessed via JavaScript (for security purposes)
            secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict'
        }).json({ success: true, message: "User LoggedOut" })
    } catch (error) {
        return res.json({ success: false, message: "Error While loggout" })
    }
}

//send otp 
export const sendOtp = async (req, res) => {

    try {
        const { userId } = req.body;

        const user = await UserModel.findById(userId);

        if (user.isAccountVerified === true) {
            return res.json({ success: false, message: "Account is already verified" })
        };


        const { Otp, ExpiresIn } = await GenrateVerificationOtp()


        user.verifyOtp = Otp;
        user.verifyOtpExpiredAt = ExpiresIn;

        await user.save();
        const mailOptions = {
            from: process.env.Sender_Email,
            to: user.email,
            subject: "Verify Otp",
            text: `your otp is ${Otp},use it for verification , valid for 5 minutes`
        }

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: 'OTP send on registred email' })

    } catch (error) {
        return res.json({ success: false, message: "Error While generating OTP" })
    }


}

//verify otp
export const VerifyOtp = async (req, res) => {

    try {
        const { userId, otp } = req.body;

        const user = await UserModel.findById(userId);
        if (!user || !userId) {
            return res.json({ success: false, message: "User not found" })
        }

        const verifyOTP = user.verifyOtp;
        if (verifyOTP === "" || verifyOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiredAt = 0;

        await user.save();
        return res.json({ success: true, message: 'User account is verified' });
    } catch (error) {
        return res.json({ success: false, message: "Error While verifYing OTP" })
    }
}


//isAuthenticated
export const isAuthenticated = async (req, res) => {
    try {
       res.json({ success: true, message: "Authorized user" })

    } catch (error) {
        res.json({ success: false, message: "Unauthorized user, signIn again " })
    }
}

//resetOtp function
export const resetOtpHandler = async (req, res) => {

    const { email } = req.body;
    if (email) {
        

    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.json({ success: false, message: "User not found with given email , SignUp again" });
        }
        const { resetOtp, resetOtpExpiresIn } = await GenarateRestOtp();

        user.resetOtp = resetOtp;
        user.resetOtpExpiredAt = resetOtpExpiresIn;
        await user.save();


        const mailOptions = {
            from: process.env.Sender_Email,
            to: user.email,
            subject: "Verify Otp",
            text: `your otp is ${resetOtp},use it for verification , valid for 5 minutes`
        }


        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Reset Otp send on registered Email" })
    } catch (error) {
        res.json({ success: false, message: "Unauthorized user, signIn again " })
    }

}

//reset otp verrfication and update password
export const resetOtpVerification = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User with this email id not found" });
        }

        if (user.resetOtp !== otp) {
            return res.json({ success: false, message: "invalid otp" });
        }
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const salt = await bcrypt.genSalt(10);

        const newHashedPass = await bcrypt.hash(newPassword, salt);
        user.password = newHashedPass;
        user.resetOtp = "";
        user.resetOtpExpiredAt = 0;await user.save();

       
        try {
            res.clearCookie('token', {
                httpOnly: true, // The cookie cannot be accessed via JavaScript (for security purposes)
                secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS in production
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict'
            }).json({ success: true, message: "User LoggedOut,logIn again" });
        } catch (error) {
            return res.json({ success: false, message: "Error While clearing token" })
        }


        

    } catch (error) {
        return res.json({ success: false, message: "error unable to reset password" })
    }
}
