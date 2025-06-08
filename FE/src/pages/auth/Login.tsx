import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FecthLogin } from "@/services/AuthService";
import { LoginRequest } from "@/types/User";
import { EyeCloseIcon, EyeIcon } from "@/components/icons";

export default function Login() {
    const [showPhoneLogin, setShowPhoneLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfimPassword, setShowConfimPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [, setError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState<LoginRequest>({
        email: "",
        password: ""
    });

    const handleInputLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserLogin((prev) => ({ ...prev, [name]: value }));
        // Clear login error when user starts typing
        if (loginError) {
            setLoginError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent, formType: string) => {
        e.preventDefault();
        setError("");
        setLoginError("");
        setIsLoading(true);

        try {
            switch (formType) {
                case "phone": {
                    const phone = (e.target as HTMLFormElement).phone.value;
                    await new Promise(resolve => setTimeout(resolve, 800));
                    navigate("/confirm-otp", { state: { phone } });
                    break;
                }
                case "login": {
                    await FecthLogin(userLogin);
                    navigate('/');
                    break;
                }
                case "register": {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    break;
                }
                case "forgotPassword": {
                    const email = (e.target as HTMLFormElement).email.value;
                    await new Promise(resolve => setTimeout(resolve, 800));
                    navigate("/confirm-otp", { state: { email } });
                    break;
                }
                default:
                    throw new Error("Invalid form type");
            }
        } catch (err) {
            if (formType === "login") {
                setLoginError("Incorrect email or password");
            } else {
                setError(err instanceof Error ? err.message : "An error occurred, please try again.");
            }
        } finally {
            setIsLoading(false); // End loading regardless of outcome
        }
    };




    const togglePhoneLogin = () => {
        setShowPhoneLogin(!showPhoneLogin);
        setShowRegister(false);
        setShowForgotPassword(false);
    };

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
        setShowPhoneLogin(false);
        setShowRegister(false);
    };

    const toggleForm = () => {
        setShowRegister(!showRegister);
        setShowPhoneLogin(false);
        setShowForgotPassword(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gray-50">
            <AnimatePresence mode="wait">
                {!showRegister && !showForgotPassword ? (
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
                            {!showPhoneLogin ? (
                                <form className="space-y-6" onSubmit={(e) => handleSubmit(e, "login")}>
                                    <div className="mb-12">
                                        <h3 className="text-slate-900 text-3xl text-center font-semibold">Sign in</h3>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="text-slate-800 text-sm font-medium mb-2 block">
                                            Email
                                        </label>
                                        <motion.input
                                            name="email"
                                            id="email"
                                            type="text"
                                            onChange={handleInputLoginChange}
                                            value={userLogin.email}
                                            required
                                            disabled={isLoading}
                                            className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 disabled:bg-slate-100 disabled:text-slate-500"
                                            placeholder="Enter your email"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="text-slate-800 text-sm font-medium mb-2 block">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <motion.input
                                                name="password"
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                onChange={handleInputLoginChange}
                                                value={userLogin.password}
                                                required
                                                disabled={isLoading}
                                                className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600 disabled:bg-slate-100 disabled:text-slate-500"
                                                placeholder="Enter password"
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
                                            <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">
                                                Remember me
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={toggleForgotPassword}
                                            disabled={isLoading}
                                            className="text-blue-600 hover:underline font-medium text-sm disabled:opacity-50"
                                        >
                                            Forgot your password?
                                        </button>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        variants={{
                                            hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                        }}
                                        whileHover={!isLoading ? "hover" : undefined}
                                        whileTap={!isLoading ? { scale: 0.95 } : undefined}
                                        className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 relative"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="opacity-0">Sign in</span>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            </>
                                        ) : (
                                            "Sign in"
                                        )}
                                    </motion.button>
                                </form>
                            ) : (
                                <form className="space-y-6" onSubmit={(e) => handleSubmit(e, "phone")}>
                                    <div className="mb-12">
                                        <h3 className="text-slate-900 text-3xl text-center font-semibold">Sign in with Phone</h3>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="text-slate-800 text-sm font-medium mb-2 block">
                                            Phone
                                        </label>
                                        <motion.input
                                            name="phone"
                                            id="phone"
                                            type="tel"
                                            required
                                            className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                            placeholder="Enter your phone"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        variants={{
                                            hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                        }}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                    >
                                        Send OTP
                                    </motion.button>
                                </form>
                            )}
                            <div className="flex items-center w-full my-4">
                                <div className="flex-grow h-px bg-gray-300" />
                                <span className="px-4 text-sm text-gray-500 whitespace-nowrap">or sign up with
                                </span>
                                <div className="flex-grow h-px bg-gray-300" />
                            </div>
                            <motion.button
                                type="button"
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                }}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                className="w-full font-bold shadow-sm rounded-lg py-3 text-gray-800 flex border-2 items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
                            >
                                <div className="bg-white rounded-full">
                                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                                        <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                                        <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                                        <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                                        <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                                    </svg>
                                </div>
                                <span className="ml-4">Sign In with Google</span>
                            </motion.button>
                            {!showPhoneLogin && (
                                <motion.button
                                    type="button"
                                    onClick={togglePhoneLogin}
                                    variants={{
                                        hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
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
                                    <span className="ml-4">Sign In with Phone Number</span>
                                </motion.button>
                            )}
                            {showPhoneLogin && (
                                <p className="text-sm mt-6 text-center text-slate-500">
                                    Use password instead?{" "}
                                    <button
                                        type="button"
                                        onClick={togglePhoneLogin}
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Sign in with Password
                                    </button>
                                </p>
                            )}
                            <p className="text-sm mt-6 text-center text-slate-500">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Register here
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
                ) : showRegister ? (
                    <motion.div
                        key="register-page"
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
                        {/* Register Text Section */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 0 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
                                Seamless Registration for Exclusive Access
                            </h2>
                            <p className="text-sm mt-6 text-slate-500 leading-relaxed">
                                Create your account effortlessly with our intuitive registration form. Join now to unlock exclusive features.
                            </p>
                            <p className="text-sm mt-12 text-slate-500">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Sign in here
                                </button>
                            </p>
                        </motion.div>

                        {/* Register Form */}
                        <motion.form
                            className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto"
                            variants={{
                                hidden: { opacity: 0, y: 0 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                            onSubmit={(e) => handleSubmit(e, "register")}
                        >
                            <h3 className="text-slate-900 text-center lg:text-3xl text-2xl font-bold mb-8">Register</h3>
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="email" className="text-sm text-slate-800 font-medium mb-2 block">
                                        Email
                                    </label>
                                    <motion.input
                                        name="email"
                                        type="email"
                                        required
                                        className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                                        placeholder="Enter Email"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="text-sm text-slate-800 font-medium mb-2 block">
                                        Phone
                                    </label>
                                    <motion.input
                                        name="phone"
                                        type="tel"
                                        required
                                        className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                                        placeholder="Enter Phone"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="text-sm text-slate-800 font-medium mb-2 block">
                                        Full Name
                                    </label>
                                    <motion.input
                                        name="name"
                                        type="text"
                                        required
                                        className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                                        placeholder="Enter Name"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="text-sm text-slate-800 font-medium mb-2 block">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <motion.input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                                            placeholder="Enter Password"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 " />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="re-password" className="text-sm text-slate-800 font-medium mb-2 block">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <motion.input
                                            name="re-password"
                                            type={showConfimPassword ? "text" : "password"}
                                            required
                                            className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                                            placeholder="Confirm Password"
                                            whileFocus={{ scale: 1.02 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfimPassword(!showConfimPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showConfimPassword ? (
                                                <EyeIcon className="fill-gray-500 " />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={toggleForgotPassword}
                                        className="text-blue-600 hover:underline font-medium text-sm"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                            </div>
                            <motion.button
                                type="submit"
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                }}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mt-5"
                            >
                                Register
                            </motion.button>
                            <div className="flex items-center w-full my-4">
                                <div className="flex-grow h-px bg-gray-300" />
                                <span className="px-4 text-sm text-gray-500 whitespace-nowrap">or sign up with
                                </span>
                                <div className="flex-grow h-px bg-gray-300" />
                            </div>
                            <motion.button
                                type="button"
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                }}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                className="w-full font-bold shadow-sm rounded-lg py-3 text-gray-800 flex border-2 items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
                            >
                                <div className="bg-white rounded-full">
                                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                                        <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                                        <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                                        <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                                        <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                                    </svg>
                                </div>
                                <span className="ml-4">Sign Up with Google</span>
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={togglePhoneLogin}
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
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
                                <span className="ml-4">Sign Up with Phone Number</span>
                            </motion.button>
                        </motion.form>
                    </motion.div>
                ) : (
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
                                Recover Your Account
                            </h2>
                            <p className="text-sm mt-6 text-slate-500 leading-relaxed">
                                Enter your email to receive a one-time password to reset your account.
                            </p>
                            <p className="text-sm mt-12 text-slate-500">
                                Back to{" "}
                                <button
                                    type="button"
                                    onClick={toggleForgotPassword}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Sign in
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
                            onSubmit={(e) => handleSubmit(e, "forgotPassword")}
                        >
                            <h3 className="text-slate-900 text-center lg:text-3xl text-2xl font-bold mb-8">
                                Forgot Password
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="email" className="text-sm text-slate-800 font-medium mb-2 block">
                                        Email
                                    </label>
                                    <motion.input
                                        name="email"
                                        type="email"
                                        required
                                        className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent"
                                        placeholder="Enter Email"
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                            </div>
                            <motion.button
                                type="submit"
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                }}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mt-5"
                            >
                                Send OTP
                            </motion.button>
                            <div className="flex items-center w-full my-4">
                                <div className="flex-grow h-px bg-gray-300" />
                                <span className="px-4 text-sm text-gray-500 whitespace-nowrap">or sign up with
                                </span>
                                <div className="flex-grow h-px bg-gray-300" />
                            </div>
                            <motion.button
                                type="button"
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
                                }}
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                className="w-full font-bold shadow-sm rounded-lg py-3 text-gray-800 flex border-2 items-center justify-center transition-all duration-300 ease-in-out focus:outline-none"
                            >
                                <div className="bg-white rounded-full">
                                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                                        <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                                        <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                                        <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                                        <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                                    </svg>
                                </div>
                                <span className="ml-4">Sign In with Google</span>
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={togglePhoneLogin}
                                variants={{
                                    hover: { scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" },
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
                                <span className="ml-4">Sign In with Phone Number</span>
                            </motion.button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
