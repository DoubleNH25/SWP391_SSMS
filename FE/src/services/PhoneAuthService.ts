import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/utils/firebase";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export const initReCAPTCHA = (containerId = "recaptcha-container"
  , onVerified?: () => void
): Promise<void> => {
  return new Promise(async (resolve) => {
    // Nếu đã tồn tại reCAPTCHA, xóa nó để render lại
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = ""; // clear DOM
    }

    // Tạo mới
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "normal",
      callback: (response: string) => {
        if (onVerified) onVerified(); 
        resolve();
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired");
      },
    });

    await recaptchaVerifier.render().then((widgetId) => {
      console.log("🛡️ reCAPTCHA widget ID:", widgetId);
    });
  });
};

export const sendOTP = async (phone: string): Promise<void> => {
  if (!recaptchaVerifier) {
    throw new Error("Vui lòng khởi tạo reCAPTCHA trước.");
  }

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    console.log("✅ OTP sent");
  } catch (error: any) {
    console.error("❌ Lỗi gửi OTP:", error);
    throw new Error("Không thể gửi OTP: " + (error?.message || "Lỗi không xác định"));
  }
};

export const verifyOTP = async (code: string): Promise<UserCredential> => {
  if (!confirmationResult) {
    throw new Error("Chưa gửi OTP hoặc chưa có xác nhận hợp lệ.");
  }

  try {
    return await confirmationResult.confirm(code);
  } catch (error: any) {
    throw new Error("Mã OTP sai hoặc đã hết hạn.");
  }
};
