import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"  // or your toast library
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"

export default function EmailVerify() {
    const navigate = useNavigate()
    const { backendURI, getUserData, } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyEmail = async (e) => {
        e.preventDefault() // prevent page reload
        setIsLoading(true);
        const code = document.getElementById("verification-code").value

        try {
            const { data } = await axios.post(
                `${backendURI}/api/v1/auth/verify-account`,
                { otp: code },
                { withCredentials: true }
            )

            if (data.success) {
                toast.success("Email verified successfully!")
                getUserData();
                navigate("/")
            } else {
                toast.error(data.message || "Email verification failed.")
            }
        } catch (error) {
            toast.error("Error verifying email: " + error.message)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-md space-y-6 py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Verify your email</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    We've sent a verification code to your email address. Enter the code below to confirm your identity.
                </p>
            </div>
            <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div>
                    <Label className="mb-3" htmlFor="verification-code">
                        Verification Code
                    </Label>
                    <Input
                        id="verification-code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                        disabled={isLoading}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </>
                    ) : (
                        "Verify Email"
                    )}
                </Button>
            </form>
        </div>
    )
}