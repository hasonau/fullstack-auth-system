import { useState, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const { backendURI } = useContext(AppContext);
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: send reset OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${backendURI}/api/v1/auth/send-password-otp`,
                { email }
            );
            toast.success(data.message || "OTP sent to your email.");
            setStep(2);
        } catch (error) {
            const msg =
                error.response?.data?.message || // backend ApiError message
                error.message ||
                "Something went wrong";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${backendURI}/api/v1/auth/verify-reset-otp`,
                { email, otp }
            );
            toast.success(data.message || "OTP verified. Please set your new password.");
            setStep(3);
        } catch (error) {
            const msg =
                error.response?.data?.message || // backend ApiError message
                error.message ||
                "Something went wrong";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${backendURI}/api/v1/auth/reset-password`,
                { email, password }
            );
            toast.success(data.message || "Password reset successfully. You can login now.");
            setStep(1);
            setEmail("");
            setOtp("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            const msg =
                error.response?.data?.message || // backend ApiError message
                error.message ||
                "Something went wrong";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-md">
                <Card>
                    <CardContent>
                        {step === 1 && (
                            <form onSubmit={handleSendOtp}>
                                <h2 className="text-2xl font-bold mb-6 text-center">
                                    Reset Password
                                </h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Enter your email
                                    </label>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending OTP...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp}>
                                <h2 className="text-2xl font-bold mb-6 text-center">
                                    Verify OTP
                                </h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="otp"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Enter the OTP sent to {email}
                                    </label>
                                    <Input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </Button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword}>
                                <h2 className="text-2xl font-bold mb-6 text-center">
                                    Set New Password
                                </h2>
                                <div className="mb-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        New Password
                                    </label>
                                    <Input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ResetPassword;