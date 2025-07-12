import { useLocation, useNavigate } from "react-router-dom";
import { VerifyOTPRequest, VerifyOTPEmailRequest } from "@/types/User";
import { useEffect, useState } from "react";
import {
  FecthVerifyOTP,
  FecthVerifyEmailOTP,
  FecthForgetPassword,
} from "@/services/AuthService";
import { initReCAPTCHA, sendOTP, verifyOTP } from "@/services/PhoneAuthService";

export default function ConfirmOTP() {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { phone, email, isRegister } = useLocation().state || {};
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpExpiration, setOtpExpiration] = useState(0);

  // Determine if this is email OTP or phone OTP
  const isEmailOTP = !!email;
  const contactInfo = email || phone;

  // Set OTP expiration time based on type
  useEffect(() => {
    if (contactInfo) {
      const expirationTime = isEmailOTP ? 5 * 60 : 1 * 60; // 5 minutes for email, 1 minute for phone
      setOtpExpiration(expirationTime);
    }
  }, [contactInfo, isEmailOTP]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (numbers.length > 0) {
      const newOtp = [...otp];
      numbers.forEach((num, index) => {
        if (index < 6) {
          newOtp[index] = num;
        }
      });
      setOtp(newOtp);
      
      // Focus on the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(numbers.length, 5);
      const nextInput = document.getElementById(`otp-${focusIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (isResending || resendCooldown > 0) return;
    
    try {
      if (isEmailOTP) {
        // For email OTP, call the resend email OTP API
        setIsResending(true);
        const success = await FecthForgetPassword(email);
        if (success) {
          setInfo("Đã gửi lại mã OTP");
          setIsVerified(false);
          setOtp(["", "", "", "", "", ""]);
          setError("");
          setResendCooldown(30);
          setOtpExpiration(5 * 60); // Reset to 5 minutes for email
          setTimeout(() => {
            document.getElementById("otp-0")?.focus();
          }, 100);
        } else {
          setError("Không thể gửi lại OTP");
        }
        setIsResending(false);
        return;
      }

      setShowCaptchaModal(true);

      // ✨ Đợi Modal render xong rồi mới init CAPTCHA
      setTimeout(async () => {
        try {
          await initReCAPTCHA("recaptcha-container");
          await sendOTP(phone);

          setInfo("Đã gửi lại mã OTP");
          setIsVerified(false);
          setOtp(["", "", "", "", "", ""]);
          setError("");
          setResendCooldown(30);
          setOtpExpiration(1 * 60); // Reset to 1 minute for phone
          setTimeout(() => {
            document.getElementById("otp-0")?.focus();
          }, 100);
        } catch (err) {
          console.error("❌ Lỗi gửi OTP:", err);
          setError("Không thể gửi lại OTP");
          setInfo("");
        } finally {
          setShowCaptchaModal(false);
        }
      }, 300); // ⚠ Delay giúp Modal render xong trước khi gắn CAPTCHA
    } catch (err) {
      console.error("❌ Lỗi hiển thị CAPTCHA:", err);
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (otp.some((digit) => digit === "")) {
      setError("Vui lòng nhập đầy đủ OTP");
      setIsSubmitting(false);
      return;
    }

    const otpCode = otp.join("");

    try {
      if (isEmailOTP) {
        // Handle email OTP verification
        const data = {
          email,
          otp: otpCode,
        } as VerifyOTPEmailRequest;
        const resetToken = await FecthVerifyEmailOTP(data);
        console.log("Reset token", resetToken);
        setIsVerified(true);
        // Navigate to reset password page with the reset token
        navigate("/reset-password", {
          state: {
            email,
            resetToken,
            message: "Xác thực OTP thành công. Vui lòng đặt lại mật khẩu.",
          },
        });
      } else {
        // Handle phone OTP verification (existing logic)
        const userCredential = await verifyOTP(otpCode);
        const idToken = await userCredential.user.getIdToken();
        console.log("IdToken", idToken);
        console.log("Phone", phone);
        const verifyOTPRequest: VerifyOTPRequest = {
          idToken,
          phoneNumber: phone,
        };

        const isSuccess = await FecthVerifyOTP(verifyOTPRequest);

        if (isSuccess) {
          setIsVerified(true);
          if (isRegister) {
            navigate("/login", {
              state: { message: "Đăng ký thành công. Vui lòng đăng nhập." },
            });
          } else {
            navigate("/");
          }
        } else {
          setError("OTP không hợp lệ");
        }
      }
    } catch (err) {
      setError("Lỗi khi xác thực OTP");
      if (isEmailOTP) {
        navigate("/login", { state: { email } });
      } else if (isRegister) {
        navigate("/register", { state: { phone } });
      } else {
        navigate("/login", { state: { phone } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!contactInfo) navigate("/login");
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown, contactInfo]);

  useEffect(() => {
    if (otpExpiration === 0) return;
    const timer = setInterval(() => {
      setOtpExpiration((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpExpiration]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-blue-500 py-20 px-3">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto md:max-w-lg">
          <div className="w-full">
            <div className="bg-white py-6 px-4 rounded text-center shadow-md">
              <form
                className="flex flex-col items-center mt-4"
                onSubmit={handleSubmit}
              >
                {isVerified ? (
                  <div className="flex flex-col items-center mt-4">
                    <span className="text-green-600 font-semibold">
                      Xác thực thành công ✅
                    </span>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => navigate("/")}
                    >
                      Quay về trang chủ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col mt-4 text-gray-600">
                      <span>Nhập OTP đã nhận được tại</span>
                      <span className="font-bold text-black">
                        {contactInfo}
                      </span>
                    </div>

                    {/* OTP Expiration Timer */}
                    {otpExpiration > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Mã OTP hết hạn sau: </span>
                        <span className={`font-semibold ${otpExpiration <= 30 ? 'text-red-500' : 'text-blue-600'}`}>
                          {formatTime(otpExpiration)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-center gap-2 mt-5">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          className="w-10 h-10 border rounded text-center text-lg focus:outline-blue-400"
                          type="text"
                          maxLength={1}
                          disabled={isSubmitting || otpExpiration === 0}
                          value={digit}
                          onChange={(e) => handleChange(e.target.value, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                        />
                      ))}
                    </div>

                    {/* 🔔 Thông báo */}
                    {info && <p className="text-green-500 mt-2">{info}</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {otpExpiration === 0 && (
                      <p className="text-red-500 mt-2">Mã OTP đã hết hạn. Vui lòng gửi lại.</p>
                    )}

                    {/* 🔘 Gửi & resend OTP */}
                    <div className="flex flex-col items-center mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting || otpExpiration === 0}
                        className="shadow-sm py-2.5 px-10 text-md font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed"
                      >
                        {isSubmitting
                          ? "Đang xử lý..."
                          : otpExpiration === 0
                          ? "OTP đã hết hạn"
                          : isEmailOTP
                          ? "Xác thực OTP"
                          : isRegister
                          ? "Đăng ký"
                          : "Xác thực tài khoản"}
                      </button>

                      <span className="mt-4 text-sm text-gray-500">
                        Không nhận được mã?
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={resendCooldown > 0 || isResending}
                          className="ml-1 text-blue-600 font-semibold hover:text-blue-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isResending
                            ? "Đang gửi..."
                            : resendCooldown > 0
                            ? `${resendCooldown}s`
                            : "Gửi lại OTP"}
                        </button>
                      </span>
                    </div>
                  </>
                )}
              </form>

              {/* ⬅️ Back to login */}
              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  Quay lại
                  <a
                    href="/login"
                    className="text-blue-600 font-bold hover:text-blue-800 ml-1"
                  >
                    Đăng nhập lại
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCaptchaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Xác minh bảo mật</h3>
            <div id="recaptcha-container" className="flex justify-center" />
            <p className="mt-4 text-sm text-gray-500">
              Vui lòng hoàn thành xác minh CAPTCHA để tiếp tục.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
