import axios from 'axios';
import { apiUrl, apiConfig } from "./apiConfig";
import { MyAccount } from "@/types/myAccount";

const getCsrfCookie = async () => {
    await axios.get(`${apiUrl}/csrf-cookie`, apiConfig);
}

const authenticateUser = async (email: string, password: string): Promise<MyAccount | null> => {
    try {
        const response = await axios.post(`${apiUrl}/auth/login`, { email, password }, apiConfig);
        if (response.status === 200) {
            return {
                id: response.data.id,
                full_name: response.data.full_name,
                avatar_url: response.data.avatar_url,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                email: response.data.email,
                hasTwoFactorEnabled: response.data.has_two_factor_enabled,
                permissions: response.data.permissions
            };
        }
        return null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Authentication failed');
        }
        throw new Error('Network or other error');
    }
};

const logout = async (): Promise<boolean> => {
    const response = await axios
            .post(`${apiUrl}/auth/logout`, {}, apiConfig)
            .catch(() => null);

    return (response !== null && response.status === 204);
}

export {
    getCsrfCookie,
    authenticateUser,
    logout
}