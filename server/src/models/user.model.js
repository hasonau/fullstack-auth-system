import { mongoose, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    verifyOTP: {
        type: String,
        default: ''
    },
    verifyOTP_Expiry: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOTP: {
        type: String,
        default: ''
    },
    resetOTP_Expiry: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

userSchema.methods.createRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };