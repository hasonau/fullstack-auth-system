import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.route.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Error-handling middleware (after routes)
app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(err.toJSON ? err.toJSON() : {
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export { app };
