import { LoginRequest, LoginResponse } from "@/types/User";
import ApiClient from "@/utils/ApiBase";

export async function FecthLogin(users: LoginRequest): Promise<void> {
    if (!users || !users.email || !users.password) {
        throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
    }
    try {
        const response = await ApiClient<LoginResponse>({
            method: 'POST',
            endpoint: '/auth/login',
            data: users,
            requiresToken: false,
        });
        if (!response || !response.data || !response.data.token) {
            throw new Error("Incorrect email or password");
        }
        localStorage.setItem('token', response.data.token);
    } catch (err: any) {
        console.error("Failed to login:", err);
        throw new Error("Incorrect email or password");
    }
}

export async function FecthLogout(): Promise<void> {
    try {
        await ApiClient<string>({
            method: 'POST',
            endpoint: '/auth/logout',
            requiresToken: true,
        });
    } catch (err) {
        console.error("Logout API call failed:", err);
    } finally {
        localStorage.removeItem('token');
    }
}