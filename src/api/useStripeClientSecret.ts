import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchStripeClientSecret = async (items: { id: string, amount: number }[]) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-payment-intent`, {
            items: items,
        }, {
            headers: { 'Content-Type': 'application/json' },
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
