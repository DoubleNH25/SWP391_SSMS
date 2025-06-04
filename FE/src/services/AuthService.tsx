import { LoginRequest, LoginResponse } from "@/types/User";
import ApiClient from "@/utils/ApiBase";

export async function FecthLogin(users: LoginRequest): Promise<void> {
    if (!users || !users.email || !users.password) {
        console.error("Invalid login request data:", users);
    }
    try {
        const response = await ApiClient<LoginResponse>({
            method: 'POST',
            endpoint: '/auth/login',
            data: users,
            requiresToken: false,
        });
        if (!response || !response.data || !response.data.token) {
            console.error("Invalid response from login API:", response);
            return;
        }
        localStorage.setItem('token', response.data.token);
    } catch (err) {
        console.error("Failed to login:", err);
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