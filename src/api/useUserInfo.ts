import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UserInfo {
    userId: string;
    username: string;
    full_name: string;
    email: string;
    picture: string;
}

const fetchUserInfo = async (userId: string): Promise<UserInfo> => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
    return data;
};

export const useUserInfo = (userId: string) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUserInfo(userId),
        enabled: !!userId,
    });
};
