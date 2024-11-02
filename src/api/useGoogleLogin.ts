import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface LoginResponse {
    token?: string;
}

const fetchGoogleLogin = async (token: string): Promise<LoginResponse> => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/google-login`,
        { token },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data;
};

export const useGoogleLogin = () => {
    return useMutation<LoginResponse, Error, string>({
        mutationFn: fetchGoogleLogin,
    });
}