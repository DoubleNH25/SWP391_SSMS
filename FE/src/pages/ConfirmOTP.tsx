import { useNavigate } from "react-router-dom";

export default function ConfirmOTP() {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        navigate("/dashboard");
    };
    
    return (
        <div className="h-screen bg-blue-500 py-20 px-3">
            <div className="container mx-auto">
                <div className="max-w-md mx-auto md:max-w-lg">
                    <div className="w-full">
                        <div className="bg-white h-70 py-3 rounded text-center">
                            <h1 className="text-2xl font-bold">OTP Verification</h1>
                            <form className="flex flex-col items-center mt-4" onSubmit={handleSubmit}>

                                <div className="flex flex-col mt-4">
                                    <span>Enter the OTP you received at</span>
                                    <span className="font-bold">+91 ******876</span>
                                </div>

                                <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
                                    <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="first" maxLength={1} />
                                    <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="second" maxLength={1} />
                                    <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="third" maxLength={1} />
                                    <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="fourth" maxLength={1} />
                                    <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="fifth" maxLength={1} />
                                    <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="sixth" maxLength={1} />
                                </div>

                                <div className="flex flex-col items-center mt-5">
                                    <button
                                        type="submit"
                                        className="shadow-sm py-2.5 px-10 text-md font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                    >
                                        Verify Account
                                    </button>
                                    <span className="mt-5 text-gray-500">
                                        Didn't receive code?
                                        <a
                                            className="justify-center mt-3 text-blue-600 hover:text-blue-900 cursor-pointer"
                                            role="button"
                                        >
                                            <span className="font-bold"> Resend OTP</span>
                                            <i className="bx bx-caret-right ml-1" />
                                        </a>
                                    </span>
                                </div>
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
    )
}