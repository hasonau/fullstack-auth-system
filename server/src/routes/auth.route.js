import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    registerUser,
    loginUser,
    logoutUser,
    sendVerifyOTP,
    verifyEmail,
    isLoggedIn,
    sendPasswordOTP,
    resetPassword,
    verifyResetOTP
} from "../controllers/auth.controller.js"
import { userAuth } from "../middlewares/userauth.js";

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', userAuth, logoutUser);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOTP);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/isloggedIn', userAuth, isLoggedIn);
authRouter.post('/send-password-otp', sendPasswordOTP);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/verify-reset-otp', verifyResetOTP);
export { authRouter };