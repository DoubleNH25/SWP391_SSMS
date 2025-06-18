import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/types/Firebase";

class PhoneAuthService {
  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.startsWith("0")) return "+84" + cleaned.slice(1);
    if (cleaned.startsWith("84")) return "+" + cleaned;
    if (cleaned.startsWith("+84")) return cleaned;

    throw new Error("Số điện thoại không hợp lệ.");
  }
  
  setupInvisibleRecaptcha(containerId = "recaptcha-container") {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: (response: any) => {
          console.log("Recaptcha verified:", response);
        },
        'expired-callback': () => {
          this.recaptchaVerifier?.clear();
          this.recaptchaVerifier = null;
        },
      });
    }
    return this.recaptchaVerifier;
  }
  

  async sendOTP(phoneNumber: string): Promise<void> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const verifier = this.setupInvisibleRecaptcha();
      this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  async verifyOTP(otp: string): Promise<string> {
    try {
      if (!this.confirmationResult) throw new Error("Chưa gửi OTP");
      const result = await this.confirmationResult.confirm(otp);
      return await result.user.getIdToken();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  async signInWithPhone(phoneNumber: string, otp: string): Promise<string> {
    try {
      await this.sendOTP(phoneNumber);
      return await this.verifyOTP(otp);
    } catch (error) {
      console.error("Error signing in with phone:", error);
      throw error;
    }
  }

  async registerWithPhone(phoneNumber: string, otp: string): Promise<string> {
    try {
      await this.sendOTP(phoneNumber);
      return await this.verifyOTP(otp);
    } catch (error) {
      console.error("Error registering with phone:", error);
      throw error;
    }
  }

  reset() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }
}

export default new PhoneAuthService();