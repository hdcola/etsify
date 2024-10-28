import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const fetchClientSecret = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
            items: [{ id: 'xl-tshirt', amount: 1000 }],
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

export const useStripeClientSecret = () => {
    return useQuery({ queryKey: ['clientSecret'], queryFn: fetchClientSecret });
};