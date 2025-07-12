import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FecthLogin } from "@/services/AuthService";
import { LoginRequest } from "@/types/User";
import { EyeCloseIcon, EyeIcon } from "@/components/icons";
import { initReCAPTCHA, sendOTP } from "@/services/PhoneAuthService";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/utils/firebase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [, setIsRecaptchaVerified] = useState(false);

  const handleInputLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError("");
    setLoginError("");
    setIsLoading(true);

    try {
      await FecthLogin(userLogin);
      navigate("/dashboard");
    } catch (err) {
      setLoginError("Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePhoneLogin = () => {
    navigate("/login-phone");
  };

  const toggleForgotPassword = () => {
    navigate("/forgot-password");
  };

  useEffect(() => {
    if (auth) {
      setTimeout(async () => {
        const container = document.querySelector("#recaptcha-container");
        if (container) {
          try {
            await initReCAPTCHA("recaptcha-container", () => {
              setIsRecaptchaVerified(true); // ✅ Đánh dấu đã xác thực
            }).catch(console.error);
          } catch (err) {
            console.error("reCAPTCHA init error", err);
          }
        }
      }, 0);
    }
  }, [auth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gray-50">
      <motion.button
        onClick={() => navigate("/")}
        aria-label="Về Trang Chủ"
        initial={{ width: 48 }}
        whileHover={{ width: 160 }}
        transition={{ type: "spring", stiffness: 340, damping: 24 }}
        className="
          absolute top-6 left-6 z-10
          flex items-center overflow-hidden
          rounded-full bg-white border border-gray-200 shadow
          text-blue-600 hover:text-white
          hover:bg-blue-600 transition-colors
          p-2 group
        "
        style={{ minWidth: 48, height: 48 }}
      >
        <ArrowLeft className="w-6 h-6 flex-shrink-0" />
        <span
          className="
            ml-2 whitespace-nowrap text-base font-medium
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            text-blue-600 group-hover:text-white
          "
        >
          Trở về Home
        </span>
      </motion.button>
      <AnimatePresence mode="wait">
        <motion.div
          key="login-page"
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
          {/* Login Form */}
          <motion.div
            className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto"
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <div>
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="mb-12">
                  <h3 className="text-slate-900 text-3xl text-center font-semibold">
                    Đăng nhập
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-slate-800 text-sm font-medium mb-2 block"
                  >
                    Email
                  </label>
                  <motion.input
                    name="email"
                    id="email"
                    type="text"
                    onChange={handleInputLoginChange}
                    value={userLogin.email ?? ""}
                    required
                    disabled={isLoading}
                    className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="Nhập email"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-slate-800 text-sm font-medium mb-2 block"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <motion.input
                      name="password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleInputLoginChange}
                      value={userLogin.password ?? ""}
                      required
                      disabled={isLoading}
                      className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Nhập mật khẩu"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 " />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <div className="text-red-600 text-sm text-center mt-3 font-medium">
                    {loginError}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      disabled={isLoading}
                      className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm text-slate-500"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    disabled={isLoading}
                    className="text-blue-600 hover:underline font-medium text-sm disabled:opacity-50"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
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
                  className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed relative"
                >
                  {isLoading ? (
                    <>
                      <span className="opacity-0">Đăng nhập</span>
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
                    "Đăng nhập"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="flex items-center w-full my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
                hoặc đăng nhập bằng
              </span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
            <motion.button
              type="button"
              onClick={togglePhoneLogin}
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
