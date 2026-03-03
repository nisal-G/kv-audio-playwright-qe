import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiCheckCircle, FiRefreshCw } from "react-icons/fi";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef([]);
    const dataFetchedRef = useRef(false);

    // Initialize input refs
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Send OTP on component mount
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        if (!token) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }
        sendOTP();
    }, [token, navigate]);

    const sendOTP = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/sendOTP`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("OTP sent to your email!");
        } catch (error) {
            console.error("Failed to send OTP:", error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        try {
            await sendOTP();
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error("Failed to resend OTP:", error);
        } finally {
            setIsResending(false);
        }
    };

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();
        const digits = pastedData.match(/\d/g);

        if (digits) {
            const newOtp = [...otp];
            digits.slice(0, 6).forEach((digit, index) => {
                newOtp[index] = digit;
            });
            setOtp(newOtp);

            // Focus on the next empty input or the last input
            const nextIndex = Math.min(digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            toast.error("Please enter complete OTP");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/verifyOTP`,
                { code: otpString },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Email verified successfully!");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            console.error("Email verification failed:", error);
            toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                        <FiMail className="text-white text-4xl" />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
                    <p className="text-gray-600">
                        We've sent a 6-digit verification code to your email address. Please enter it below.
                    </p>
                </div>

                {/* OTP Input Form */}
                <form onSubmit={handleVerifyEmail} className="space-y-6">
                    <div className="flex justify-center gap-2 sm:gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 hover:border-gray-400"
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={isLoading || otp.join("").length !== 6}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <FiCheckCircle className="text-xl" />
                                Verify Email
                            </>
                        )}
                    </button>
                </form>

                {/* Resend OTP Section */}
                <div className="text-center space-y-3">
                    <p className="text-gray-600 text-sm">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResendOTP}
                        disabled={isResending}
                        className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none flex items-center justify-center gap-2 mx-auto transition-colors duration-200"
                    >
                        {isResending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Resending...
                            </>
                        ) : (
                            <>
                                <FiRefreshCw className="text-lg" />
                                Resend OTP
                            </>
                        )}
                    </button>
                </div>

                {/* Help Text */}
                <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Check your spam folder if you don't see the email
                    </p>
                </div>
            </div>
        </div>
    );
}
