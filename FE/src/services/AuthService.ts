import { LoginRequest, LoginResponse, ResetPasswordRequest, VerifyOTPEmailRequest, VerifyOTPRequest } from "@/types/User";
import ApiClient from "@/utils/ApiBase";

export async function FecthLogin(users: LoginRequest): Promise<void> {
  if (!users || !users.email || !users.password) {
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
  }
  try {
    const response = await ApiClient<LoginResponse>({
      method: "POST",
      endpoint: "/auth/login",
      data: users,
      requiresToken: false,
    });
    if (!response || !response.data || !response.data.token) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
    localStorage.setItem("token", response.data.token);
  } catch (err) {
    console.error("Failed to login:", err);
    throw new Error("Email hoặc mật khẩu không đúng");
  }
}

export async function FecthLogout(): Promise<void> {
  try {
    await ApiClient<string>({
      method: "POST",
      endpoint: "/auth/logout",
      requiresToken: true,
    });
  } catch (err) {
    console.error("Logout API call failed:", err);
  } finally {
    localStorage.removeItem("token");
  }
}

export async function FecthVerifyOTP(verifyOTPRequest: VerifyOTPRequest): Promise<boolean> {
  if (!verifyOTPRequest.idToken || !verifyOTPRequest.phoneNumber) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }
  try {
    const response = await ApiClient<LoginResponse>({
      method: "POST",
      endpoint: "/auth/verify-phonenumber",
      data: verifyOTPRequest,
      requiresToken: false,
    });
    if (!response || !response.data || !response.data.token) {
      throw new Error("Lỗi khi xác thực OTP");
    }
    localStorage.setItem("token", response.data.token);
    return true;
  } catch (err) {
    console.error("Verify OTP API call failed:", err);
    throw new Error("Lỗi khi xác thực OTP");
  }
}

export async function FecthForgetPassword(email: string): Promise<boolean> {
  if (!email) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }
  try {
    const response = await ApiClient<string>({
      method: "POST",
      endpoint: "/auth/forget-password",
      data: { email },
      requiresToken: false,
    });
    if (!response || !response.data) {
      throw new Error("Lỗi khi gửi OTP");
    }
    return response.data === "Gửi OTP thành công";
  } catch (err) {
    console.error("Forget password API call failed:", err);
    throw new Error("Lỗi khi gửi OTP");
  }
}

export async function FecthVerifyEmailOTP(verifyOTPEmailRequest: VerifyOTPEmailRequest): Promise<string> {
  if (!verifyOTPEmailRequest || !verifyOTPEmailRequest.email || !verifyOTPEmailRequest.otp) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }
  try {
    const response = await ApiClient<string>({
      method: "POST",
      endpoint: "/auth/verify-otp",
      data: verifyOTPEmailRequest,
      requiresToken: false,
    });
    if (!response || !response.data) {
      throw new Error("Lỗi khi xác thực OTP");
    }
    return response.data;
  } catch (err) {
    console.error("Verify email OTP API call failed:", err);
    throw new Error("Lỗi khi xác thực OTP");
  }
}

export async function FecthResetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<boolean> {
  if (!resetPasswordRequest || !resetPasswordRequest.email || !resetPasswordRequest.resetToken || !resetPasswordRequest.newPassword || !resetPasswordRequest.verifyPassword) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }
  try {
    const response = await ApiClient<string>({
      method: "POST",
      endpoint: "/auth/reset-password",
      data: resetPasswordRequest,
      requiresToken: false,
    });
    if (!response || !response.data) {
      throw new Error("Lỗi khi đặt lại mật khẩu");
    }
    return response.data === "Reset Password successfully";
  } catch (err) {
    console.error("Reset password API call failed:", err);
    throw new Error("Lỗi khi đặt lại mật khẩu");
  }
}


