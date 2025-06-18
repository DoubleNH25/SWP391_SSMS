import { useLocation, useNavigate } from "react-router-dom";
import { VerifyOTPRequest } from "@/types/User";
import { useEffect, useState } from "react";
import { FecthVerifyOTP } from "@/services/AuthService";
import PhoneAuthService from "@/services/PhoneAuthService";

export default function ConfirmOTP() {
    const [resendCooldown, setResendCooldown] = useState(0);
    const [info, setInfo] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const { phone, isRegister } = useLocation().state;

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (value && nextInput) nextInput.focus();
    };

    const handleResendOTP = async () => {
        try {
            await PhoneAuthService.sendOTP(phone);
            setInfo("Đã gửi lại mã OTP");
            setIsVerified(false);
            document.getElementById("otp-0")?.focus();
            setOtp(["", "", "", "", "", ""]);
            setError("");
            setResendCooldown(30);
        } catch (err) {
            setError("Không thể gửi lại OTP");
            setInfo("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.some((digit) => digit === "")) {
            setError("Vui lòng nhập đầy đủ OTP");
            return;
        }

        const otpCode = otp.join("");

        try {
            const idToken = await PhoneAuthService.verifyOTP(otpCode);

            const verifyOTPRequest: VerifyOTPRequest = {
                idToken,
                phoneNumber: phone,
            };

            const isSuccess = await FecthVerifyOTP(verifyOTPRequest);

            if (isSuccess) {
                setIsVerified(true);
                if (isRegister) {
                    navigate("/login", { state: { message: "Đăng ký thành công. Vui lòng đăng nhập." } });
                } else {
                    navigate("/");
                }
            } else {
                setError("OTP không hợp lệ");
            }
        } catch (err) {
            setError("Lỗi khi xác thực OTP");
            if (isRegister) {
                navigate("/register", { state: { phone } });
            } else {
                navigate("/login", { state: { phone } });
            }
        }
    };

    useEffect(() => {
        if (!phone) navigate("/login");
        if (resendCooldown === 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown, phone]);

    return (
        <div className="h-screen bg-blue-500 py-20 px-3">
            <div className="container mx-auto">
                <div className="max-w-md mx-auto md:max-w-lg">
                    <div className="w-full">
                        <div className="bg-white h-70 py-3 rounded text-center">
                            <h1 className="text-2xl font-bold">Xác thực OTP</h1>
                            <form className="flex flex-col items-center mt-4" onSubmit={handleSubmit}>
                                {isVerified ? (
                                    <div className="flex flex-col items-center mt-4">
                                        <span>Tài khoản đã được xác thực</span>
                                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => navigate("/")}>Đăng nhập</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col mt-4">
                                            <span>Nhập OTP đã nhận được tại</span>
                                            <span className="font-bold">{phone}</span>
                                        </div>

                                        <div className="flex justify-center gap-2 mt-5">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    className="w-10 h-10 border rounded text-center text-lg"
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleChange(e.target.value, index)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                                                            document.getElementById(`otp-${index - 1}`)?.focus();
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        {info && <p className="text-green-500 mt-2">{info}</p>}
                                        {error && <p className="text-red-500 mt-2">{error}</p>}

                                        <div className="flex flex-col items-center mt-5">
                                            <button
                                                type="submit"
                                                className="shadow-sm py-2.5 px-10 text-md font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                            >
                                                {isRegister ? "Đăng ký" : "Xác thực tài khoản"}
                                            </button>
                                            <span className="mt-5 text-gray-500">
                                                Không nhận được mã?
                                                <a
                                                    className="justify-center mt-3 text-blue-600 hover:text-blue-900 cursor-pointer"
                                                    role="button"
                                                    onClick={handleResendOTP}
                                                >
                                                    {resendCooldown > 0 ? (
                                                        <span>
                                                            {resendCooldown} giây
                                                        </span>
                                                    ) : (
                                                        <span className="font-bold"> Gửi lại OTP</span>
                                                    )}
                                                </a>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </form>
                            <div className="mt-2">
                                <span className="text-sm text-gray-500 mt-3">
                                    Back to
                                    <a href="/login" className="text-blue-600 font-bold hover:text-blue-800"> Sign In</a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}