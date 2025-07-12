import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import { FecthResetPassword } from "@/services/AuthService";
import { ResetPasswordRequest } from "@/types/User";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { email, resetToken, message } = useLocation().state || {};

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!email || !resetToken) {
      navigate("/login");
    }
  }, [email, resetToken, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    // Validate passwords
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        email,
        resetToken,
        newPassword: formData.newPassword,
        verifyPassword: formData.confirmPassword,
      } as ResetPasswordRequest;
      const isSuccess = await FecthResetPassword(data);

      if (isSuccess) {
        setSuccess("Đặt lại mật khẩu thành công!");
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập.",
            },
          });
        }, 50);
      } else {
        setError("Đã xảy ra lỗi khi đặt lại mật khẩu");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi đặt lại mật khẩu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key="reset-password-page"
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
          {/* Reset Password Text Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
              Đặt lại mật khẩu
            </h2>
            <p className="text-sm mt-6 text-slate-500 leading-relaxed">
              Nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất
              6 ký tự.
            </p>
            {message && (
              <p className="text-green-600 text-sm mt-4 font-medium">
                {message}
              </p>
            )}
          </motion.div>

          {/* Reset Password Form */}
          <motion.form
            className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto"
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            onSubmit={handleSubmit}
          >
            <h3 className="text-slate-900 text-center lg:text-3xl text-2xl font-bold mb-8">
              Mật khẩu mới
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="text-sm text-slate-800 font-medium mb-2 block"
                >
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent disabled:bg-gray-100"
                    placeholder="Nhập mật khẩu mới"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-slate-800 font-medium mb-2 block"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <motion.input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent disabled:bg-gray-100"
                    placeholder="Nhập lại mật khẩu mới"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500" />
                    )}
                  </button>
                </div>
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
                  <span className="opacity-0">Đặt lại mật khẩu</span>
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
                "Đặt lại mật khẩu"
              )}
            </motion.button>

            <div className="flex items-center w-full my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
                hoặc
              </span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <motion.button
              type="button"
              onClick={() => navigate("/login")}
              variants={{
                hover: {
                  scale: 1.05,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              className="w-full font-bold shadow-sm rounded-lg py-3 text-gray-800 flex border-2 items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
            >
              <div className="bg-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current text-gray-600"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="ml-4">Quay về đăng nhập</span>
            </motion.button>
          </motion.form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
