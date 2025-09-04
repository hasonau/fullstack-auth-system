// userauth.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"; // make sure path is correct
import { ApiError } from "../utils/ApiError.js";

const userAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new ApiError(401, "No token provided"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            res.clearCookie("refreshToken"); // optional: log them out
            return next(new ApiError(401, "User not found"));
        }
        req.user = user; // attach full user from DB
        next();
    } catch (error) {
        res.clearCookie("refreshToken"); // optional
        return next(new ApiError(403, "Invalid token"));
    }
});

export { userAuth };
