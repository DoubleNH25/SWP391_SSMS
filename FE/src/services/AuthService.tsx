import { LoginRequest, LoginResponse } from "@/types/User";
import ApiClient from "@/utils/ApiBase";

export async function FecthLogin(users: LoginRequest): Promise<void> {
    try {
        const response = await ApiClient<LoginResponse>({
            method: 'POST',
            endpoint: '/auth/login',
            data: users,
            requiresToken: false,
        });
        localStorage.setItem('token', response.data.token);
    } catch (err) {
        throw new Error(`Failed to login: ${err}`);
    }
}

export async function FecthLogout(): Promise<void> {
    try {
        await ApiClient<string>({
            method: 'POST',
            endpoint: '/auth/logout',
            requiresToken: true,
        });
        localStorage.removeItem('token');
    } catch (err) {
        throw new Error(`Failed to logout: ${err}`);
    }
}