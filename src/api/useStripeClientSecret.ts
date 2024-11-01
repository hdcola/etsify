import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useLoginStore from '../store/useLoginStore';

const fetchStripeClientSecret = async (items: { id: string, amount: number }[]) => {
    try {
        const { isLoggedIn, authToken } = useLoginStore.getState();
        if (!isLoggedIn) {
            throw new Error('User is not logged in');
        }
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, {
            items: items,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching client secret:', error);
        throw new Error('Network response was not ok');
    }
};

export interface clientSecretData {
    clientSecret: string;
    dpmCheckerLink: string;
}

export const useStripeClientSecret = (items: { id: string, amount: number }[]) => {
    return useQuery({ queryKey: ['clientSecret', items], queryFn: () => fetchStripeClientSecret(items) });
};
