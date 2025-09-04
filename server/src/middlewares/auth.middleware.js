import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = (req, res, next) => {
    // client should send: Authorization: Bearer <accessToken>
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json(new ApiError(401, "Unauthorized - No token provided"));
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json(new ApiError(403, "Forbidden - Invalid/Expired token"));
        }
        req.user = { _id: decoded._id };
        next();
    });
};

export { verifyJWT };
