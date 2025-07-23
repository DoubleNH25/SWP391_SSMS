import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FecthForgetPassword, FecthLoginGoogle } from "@/services/AuthService";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { EmailRequest } from "@/types/User";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Vui lòng nhập email");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await FecthForgetPassword(email);
      if (response) {
        setSuccess("Mã OTP đã được gửi đến email của bạn!");
        navigate("/confirm-otp", { state: { email } });
      } else {
        setError("Không tìm thấy email này.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const idToken = tokenResponse.access_token;
        const userInfo = await axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          })
          .then((res) => res.data);
        const data = userInfo as EmailRequest;
        if (idToken) {
          const response = await FecthLoginGoogle(data);
          if (response) {
            navigate("/");
          }
        } else {
          setLoginError("Không nhận được id_token từ Google");
        }
      } catch (err: any) {
        setLoginError(
          err?.response?.data?.message ||
            err?.message ||
            "Đăng nhập Google thất bại"
        );
      }
    },
    onError: () => {
      setLoginError("Đăng nhập Google thất bại");
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key="forgot-password-page"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
            exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full"
        >
          {/* Forgot Password Text Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
              Khôi phục tài khoản
            </h2>
            <p className="text-sm mt-6 text-slate-500 leading-relaxed">
              Nhập email để nhận mã OTP đặt lại mật khẩu tài khoản.
            </p>
            <p className="text-sm mt-12 text-slate-500">
              Quay lại{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </motion.div>

          {/* Forgot Password Form */}
          <motion.form
            className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto"
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            onSubmit={handleSubmit}
          >
            <h3 className="text-slate-900 text-center lg:text-3xl text-2xl font-bold mb-8">
              Quên mật khẩu
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm text-slate-800 font-medium mb-2 block"
                >
                  Email
                </label>
                <motion.input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent disabled:bg-gray-100"
                  placeholder="Nhập email"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center mt-3 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center mt-3 font-medium">
                {success}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              variants={{
                hover: {
                  scale: 1.05,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
              whileHover={!isLoading ? "hover" : undefined}
              whileTap={!isLoading ? { scale: 0.95 } : undefined}
              className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mt-5 disabled:bg-blue-400 disabled:cursor-not-allowed relative"
            >
              {isLoading ? (
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
            {loginError && (
              <div className="text-red-600 text-sm text-center mt-3 font-medium">
                {loginError}
              </div>
            )}

            <div className="flex items-center w-full my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
                hoặc đăng nhập bằng
              </span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <motion.button
              type="button"
              onClick={() => googleLogin()}
              variants={{
                hover: {
                  scale: 1.05,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              className="w-full mt-3 font-bold shadow-sm rounded-lg py-3 text-gray-800 flex border-2 items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
            >
              <div className="bg-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5"
                >
                  <g>
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.71 1.22 9.2 3.23l6.9-6.9C35.64 2.13 30.13 0 24 0 14.82 0 6.71 5.82 2.69 14.29l8.06 6.26C12.41 13.97 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.33 46.1 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.75 28.04A14.5 14.5 0 0 1 9.5 24c0-1.4.23-2.76.65-4.04l-8.06-6.26A23.97 23.97 0 0 0 0 24c0 3.82.92 7.44 2.54 10.62l8.21-6.58z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.13 0 11.28-2.03 15.04-5.53l-7.19-5.6c-2.01 1.35-4.59 2.16-7.85 2.16-6.26 0-11.59-4.47-13.25-10.38l-8.21 6.58C6.71 42.18 14.82 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </g>
                </svg>
              </div>
              <span className="ml-4">Đăng nhập bằng Google</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate("/login-phone")}
              variants={{
                hover: {
                  scale: 1.05,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              className="w-full mt-3 font-bold shadow-sm rounded-lg py-3 text-gray-800 flex border-2 items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
            >
              <div className="bg-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 28.314 28.323"
                  className="w-5 h-5 fill-current text-gray-600"
                >
                  <path d="m27.728 20.384-4.242-4.242a1.982 1.982 0 0 0-1.413-.586h-.002c-.534 0-1.036.209-1.413.586L17.83 18.97l-8.485-8.485 2.828-2.828c.78-.78.78-2.05-.001-2.83L7.929.585A1.986 1.986 0 0 0 6.516 0h-.001C5.98 0 5.478.209 5.101.587L.858 4.83C.729 4.958-.389 6.168.142 8.827c.626 3.129 3.246 7.019 7.787 11.56 6.499 6.499 10.598 7.937 12.953 7.937 1.63 0 2.426-.689 2.604-.867l4.242-4.242c.378-.378.587-.881.586-1.416 0-.534-.208-1.037-.586-1.415zm-5.656 5.658c-.028.028-3.409 2.249-12.729-7.07C-.178 9.452 2.276 6.243 2.272 6.244L6.515 2l4.243 4.244-3.535 3.535a.999.999 0 0 0 0 1.414l9.899 9.899a.999.999 0 0 0 1.414 0l3.535-3.536 4.243 4.244-4.242 4.242z" />
                </svg>
              </div>
              <span className="ml-4">Đăng nhập bằng SĐT</span>
            </motion.button>
          </motion.form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
