import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserData = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    console.log("User ID:", userId);
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) {
        res.clearCookie("refreshToken"); // delete the cookie
        return res.status(401).json(new ApiError(401, "User not found"));
    }
    return res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
});

export { getUserData };
