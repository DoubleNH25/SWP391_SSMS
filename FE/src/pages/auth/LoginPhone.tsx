import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { initReCAPTCHA, sendOTP } from "@/services/PhoneAuthService";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function LoginPhone() {
  const [phone, setPhone] = useState<string>("");
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("+84");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingOtp) return;
    
    setError("");
    setIsSendingOtp(true);
    
    let sendPhone = phone;
    const code = countryCode;
    if (!sendPhone) {
      setError("Vui lòng nhập số điện thoại");
      setIsSendingOtp(false);
      return;
    }
    // Nếu bắt đầu bằng 0 thì thay thế bằng mã vùng
    if (sendPhone.startsWith("0")) {
      sendPhone = code + sendPhone.substring(1);
    } else {
      sendPhone = code + sendPhone;
    }
    // Validate phone number format (sau khi ghép mã vùng)
    const phoneRegex = /^\+\d{10,13}$/;
    if (!phoneRegex.test(sendPhone)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.");
      setIsSendingOtp(false);
      return;
    }
    try {
      await sendOTP(sendPhone);
      navigate("/confirm-otp", { state: { phone: sendPhone } });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại.")
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  useEffect(() => {
    if (auth) {
      setTimeout(async () => {
        const container = document.querySelector("#recaptcha-container");
        if (container) {
          try {
            await initReCAPTCHA("recaptcha-container", () => {
              setIsRecaptchaVerified(true);
            }).catch(console.error);
          } catch (err) {
            console.error("reCAPTCHA init error", err);
          }
        }
      }, 0);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key="login-phone-page"
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
            exit: { opacity: 0, x: 50, transition: { duration: 0.5 } },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full"
        >
          {/* Phone Login Form */}
          <motion.div
            className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto"
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl text-center font-semibold">
                  Đăng nhập bằng SĐT
                </h3>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="text-slate-800 text-sm font-medium mb-2 block"
                >
                  Số điện thoại
                </label>
                <motion.input
                  name="phone"
                  id="phone"
                  type="tel"
                  required
                  className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 disabled:bg-slate-100 disabled:text-slate-500"
                  placeholder="Nhập số điện thoại (chỉ chấp nhận số Việt Nam)"
                  whileFocus={{ scale: 1.02 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSendingOtp}
                />
              </div>
              <div id="recaptcha-container"></div>
              {error && (
                <div className="text-red-600 text-sm text-center mt-3 font-medium">
                  {error}
                </div>
              )}
              <motion.button
                type="submit"
                disabled={!isRecaptchaVerified || isSendingOtp}
                variants={{
                  hover: {
                    scale: 1.05,
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
                whileHover={
                  !isRecaptchaVerified || isSendingOtp ? undefined : "hover"
                }
                whileTap={
                  !isRecaptchaVerified || isSendingOtp
                    ? undefined
                    : { scale: 0.95 }
                }
                className={`w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white focus:outline-none mt-5 disabled:cursor-not-allowed relative ${
                  !isRecaptchaVerified || isSendingOtp
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSendingOtp ? (
                  <>
                    <span className="opacity-0">Gửi OTP</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  </>
                ) : (
                  "Gửi OTP"
                )}
              </motion.button>
            </form>
            <p className="text-sm mt-6 text-center text-slate-500">
              Dùng email?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng nhập bằng email
              </button>
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="max-md:mt-8"
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="Login illustration"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 