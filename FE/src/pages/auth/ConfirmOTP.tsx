import { useLocation, useNavigate } from "react-router-dom";
import { VerifyOTPRequest } from "@/types/User";
import { useEffect, useState } from "react";
import { FecthVerifyOTP } from "@/services/AuthService";
import { initReCAPTCHA, sendOTP, verifyOTP } from "@/services/PhoneAuthService";
//import PhoneAuthService from "@/services/PhoneAuthService";

export default function ConfirmOTP() {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { phone, isRegister } = useLocation().state;
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (otp.some((digit) => digit === "")) {
      setError("Vui lòng nhập đầy đủ OTP");
      return;
    }

    const otpCode = otp.join("");

    try {
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
    } catch (err) {
      setError("Lỗi khi xác thực OTP");
      if (isRegister) {
        navigate("/register", { state: { phone } });
      } else {
        navigate("/login", { state: { phone } });
      }
    } finally {
      setIsSubmitting(false);
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
            <div className="bg-white py-6 px-4 rounded text-center shadow-md">
              <h1 className="text-2xl font-bold text-gray-800">Xác thực OTP</h1>

              <form
                className="flex flex-col items-center mt-4"
                onSubmit={handleSubmit}
              >
                {isVerified ? (
                  <div className="flex flex-col items-center mt-4">
                    <span className="text-green-600 font-semibold">
                      Tài khoản đã được xác thực ✅
                    </span>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => navigate("/")}
                    >
                      Về trang chủ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col mt-4 text-gray-600">
                      <span>Nhập OTP đã nhận được tại</span>
                      <span className="font-bold text-black">{phone}</span>
                    </div>

                    <div className="flex justify-center gap-2 mt-5">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          className="w-10 h-10 border rounded text-center text-lg focus:outline-blue-400"
                          type="text"
                          maxLength={1}
                          disabled={isSubmitting}
                          value={digit}
                          onChange={(e) => handleChange(e.target.value, index)}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !otp[index] &&
                              index > 0
                            ) {
                              document
                                .getElementById(`otp-${index - 1}`)
                                ?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>

                    {/* 🔔 Thông báo */}
                    {info && <p className="text-green-500 mt-2">{info}</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    {/* 🔘 Gửi & resend OTP */}
                    <div className="flex flex-col items-center mt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="shadow-sm py-2.5 px-10 text-md font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        {isRegister ? "Đăng ký" : "Xác thực tài khoản"}
                      </button>

                      <span className="mt-4 text-sm text-gray-500">
                        Không nhận được mã?
                        <a
                          className="ml-1 text-blue-600 font-semibold hover:text-blue-900 cursor-pointer"
                          onClick={handleResendOTP}
                        >
                          {resendCooldown > 0
                            ? `${resendCooldown}s`
                            : "Gửi lại OTP"}
                        </a>
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
                    Đăng nhập
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
              Vui lòng hoàn thành CAPTCHA để tiếp tục.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
