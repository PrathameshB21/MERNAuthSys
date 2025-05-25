import mongoose from "mongoose";

const userSChema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpiredAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpiredAt: { type: Number, default: 0 },
})
const UserModel = mongoose.models.User || mongoose.model('User', userSChema);
export default UserModel;
