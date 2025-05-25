import express from "express";
import {resetOtpVerification, resetOtpHandler, isAuthenticated, register, login, logout, sendOtp, VerifyOtp } from '../controllers/authController.js'
import userAuth from "../middelewere/userAuth.js";
const userRoutes = express.Router();

userRoutes.post('/Register', register)  //stores user info in db and responses as a registred
userRoutes.post('/Login', login)       //checks id email and password entered is available in database if yes then genrate token 
userRoutes.post('/Logout', logout)  //removes token means user is loggedout
userRoutes.post('/sendOtp', userAuth, sendOtp); //genrates otp send it to users email 
userRoutes.post('/sendVerifyOtp', userAuth, VerifyOtp); //verifies otp from otp stored n database and otp send by user in req.body
userRoutes.get('/IsAuthenticated', userAuth, isAuthenticated); // if user is logged in, it will have token if token is available user is authenticated
userRoutes.post('/resetOtp',  resetOtpHandler);
userRoutes.post('/verifyResetOtp',resetOtpVerification);

export default userRoutes;