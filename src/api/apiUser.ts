import axios from 'axios';
import { apiUrl, apiConfig } from "./apiConfig";
import { MyAccount } from "@/types/myAccount";
import {authError} from "@/api/apiError";
import {UserAccount} from "@/types/userAccount";



const getAuthenticatedUser = async (): Promise<MyAccount | null> => {
    try {
        const response = await axios.get(`${apiUrl}/auth/profile`, apiConfig);
        if (response.status === 200) {
            return {
                id: response.data.data.id,
                full_name: response.data.data.full_name,
                avatar_url: response.data.data.avatar_url,
                first_name: response.data.data.first_name,
                last_name: response.data.data.last_name,
                email: response.data.data.email,
                hasTwoFactorEnabled: response.data.data.has_two_factor_enabled,
                permissions: response.data.data.permissions
            };
        }
        return null;
    } catch (error) {
        throw new Error('Failed to fetch user profile');
    }
}

const searchUser = async (searchQuery: string): Promise<UserAccount[] | null> => {
    if (searchQuery) {
        const response = await axios.get(`${apiUrl}/users/following?search=${searchQuery}`, apiConfig);
        if (response.status === 200) {
            return response.data.data.map((user: any) => ({
                id: user.id,
                full_name: user.full_name,
                avatar_url: user.avatar_url,
                is_following: user.is_following
            }));
        }
    }
    return null;
}

const followUser = async (userId: number) => {
        const res = await axios.post(`${apiUrl}/users/${userId}/following`, {}, apiConfig);
        return res.status === 200;
}


const updateMyAccount = async (
    firstName: string|null,
    lastName: string|null,
    email: string|null,
    emailConfirmation: string|null,
    password: string|null,
    passwordConfirmation: string|null,
    currentPassword: string|null
): Promise<MyAccount|null> => {
    const updated: UserProfileUpdate = {};
    if (firstName !== null) {
        updated['first_name'] = firstName;
    }
    if (lastName !== null) {
        updated['last_name'] = lastName;
    }
    if (email !== null && emailConfirmation !== null) {
        updated['email'] = email;
        updated['email_confirmation'] = emailConfirmation;
    }
    if (password !== null && passwordConfirmation !== null && currentPassword !== null) {
        updated['password'] = password;
        updated['password_confirmation'] = passwordConfirmation;
        updated['current_password'] = currentPassword;
    }

    const res = await axios.put(`${apiUrl}/auth/profile`, updated, apiConfig)
        .catch((error) => {
            throw new authError(error.response.data.message);
        });

    if (res.status === 200) {
        return (
            res.data.data.id,
            res.data.data.full_name,
            res.data.data.avatar_url,
            res.data.data.first_name,
            res.data.data.last_name,
            res.data.data.email,
            res.data.data.hasTwoFactorEnabled,
            res.data.data.permissions
        );
    }
    return null;
}

const updateMyProfilePicture = async (image: File | null):Promise<string|null> => {
    const formData = new FormData();
    if (image) {
        formData.append('image', image);
    }

    const res =
        await axios.post(`${apiUrl}/auth/profile-image`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
        });

    if(res.status === 200) {
        return res.data.data;
    }

    return null;
}

const deleteMyProfilePicture = async () => {
    try {
        const response = await axios.delete(`${apiUrl}/auth/profile-image`, apiConfig);
        if (response.status === 200) {
            console.log("Profile picture deleted successfully.");
            return true;
        }
    } catch (error) {
        console.error("Failed to delete profile picture:", error);
        return false;
    }
};

export {
    getAuthenticatedUser,
    searchUser,
    followUser,
    updateMyAccount,
    updateMyProfilePicture,
    deleteMyProfilePicture,
}