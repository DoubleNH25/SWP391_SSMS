import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../types/JwtPayload";



export function DecodeJWT(): JwtPayload | null {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found in localStorage');
            return null;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.warn('Token has expired');
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
