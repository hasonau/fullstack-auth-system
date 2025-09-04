import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js"
import { transporter } from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";


const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    // Add your user registration logic here
    if (!name || !email || !password)
        return res.status(400).json(new ApiError(400, "Input fields can't be Empty",));

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json(new ApiError(409, "Email already exists"))

    const user = await User.create({ name, email, password });
    const refreshToken = user.createRefreshToken();
    const accessToken = user.createAccessToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
    const { password: _, ...userData } = user._doc;

    // Sending Welcome Email
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Welcome to GreatStack!",
        text: `Hello ${user.name},\n\nThank you for registering at GreatStack. We're excited to have you on board!\n\nBest,\nThe GreatStack Team`
    }

    await transporter.sendMail(mailOptions);

    return res.status(201).json(new ApiResponse(201, { user: userData, accessToken }, "User registered successfully"));

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json(new ApiError(400, "Email and Password are required."));

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json(new ApiError(404, "Email doesn't exist."));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json(new ApiError(401, "Incorrect Password"));

    // Check if incoming refreshToken (from cookie) matches DB one
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (incomingRefreshToken && incomingRefreshToken !== user.refreshToken) {
        // Possible token reuse attempt
        console.warn("⚠️ Refresh token reuse detected for user:", user._id);
        user.refreshToken = null; // clear it
        await user.save();
        return res.status(403).json(new ApiError(403, "Token reuse detected"));
    }

    const refreshToken = user.createRefreshToken();
    const accessToken = user.createAccessToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

    const { password: _, ...userData } = user._doc;
    return res.status(200).json(new ApiResponse(200, { user: userData, accessToken }, "User logged in successfully"));

});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

// Send verification OTP to User's Email
const sendVerifyOTP = asyncHandler(async (req, res) => {

    const requestingUser = req.user;

    const user = await User.findById(requestingUser._id);
    if (!user) throw new ApiError(404, "User not found");
    if (user.isAccountVerified) throw new ApiError(409, "User already verified");


    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOTP = otp

    user.verifyOTP_Expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: `${user.email}`,
        secure: false,
        subject: "Account Verification OTP",
        html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).json(new ApiResponse(200, null, "OTP sent to your email"));

});

const verifyEmail = asyncHandler(async (req, res) => {

    const { otp } = req.body;
    if (!otp) throw new ApiError(400, "OTP is required");

    const foundUser = await User.findById(req.user._id);
    if (!foundUser) throw new ApiError(404, "User not found");

    if (foundUser.verifyOTP !== otp) throw new ApiError(401, "Invalid OTP");
    if (foundUser.verifyOTP_Expiry < Date.now()) throw new ApiError(410, "OTP expired. Please request a new one");

    foundUser.isAccountVerified = true;
    foundUser.verifyOTP = '';
    foundUser.verifyOTP_Expiry = 0;
    await foundUser.save();

    return res.status(200).json(new ApiResponse(200, null, "Email verified successfully"));

});
const verifyResetOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;
    if (!otp || !email) throw new ApiError(400, "OTP and email are required");

    const foundUser = await User.findOne({ email });
    if (!foundUser) throw new ApiError(404, "User not found");

    if (foundUser.resetOTP !== otp) throw new ApiError(401, "Invalid OTP");
    if (foundUser.resetOTP_Expiry < Date.now()) throw new ApiError(410, "OTP expired. Please request a new one");

    // Mark OTP as verified
    foundUser.resetOTP = '';
    foundUser.resetOTP_Expiry = 0;
    await foundUser.save();

    return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});


const isLoggedIn = asyncHandler(async (req, res, next) => {
    // At this point, userAuth already verified token and fetched user from DB
    if (req.user) {
        return res.status(200).json(new ApiResponse(200, { user: req.user }, "User is logged in"));
    }
    return res.status(401).json(new ApiResponse(401, null, "Not logged in"));
});


const sendPasswordOTP = asyncHandler(async (req, res) => {

    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User with this email not found");

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTP_Expiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: `${user.email}`,
        secure: false,
        subject: "Password Reset OTP",
        html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).json(new ApiResponse(200, null, "OTP sent to your email"));

});

const resetPassword = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    // if (user.resetOTP !== otp) throw new ApiError(401, "Invalid OTP");
    // if (user.resetOTP_Expiry < Date.now()) throw new ApiError(410, "OTP expired. Please request a new one");
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) throw new ApiError(400, "New password cannot be same as old password");
    user.password = password;
    user.resetOTP = '';
    user.resetOTP_Expiry = 0;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));

});
export {
    registerUser,
    loginUser,
    logoutUser,
    sendVerifyOTP,
    verifyEmail,
    isLoggedIn,
    sendPasswordOTP,
    verifyResetOTP,
    resetPassword
};