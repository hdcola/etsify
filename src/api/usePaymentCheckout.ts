import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useLoginStore from '../store/useLoginStore';

interface PaymentCheckoutInfo {
    order_id: number;
    user_id: number;
    payment_ref: string;
    payment_method: string;
    full_name: string;
    status: string;
    total: number;
}

const fetchPaymentCheckout = async (paymentId: string): Promise<PaymentCheckoutInfo> => {
    const { authToken } = useLoginStore.getState();

    const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/checkout`,
        { paymentId },
        { headers: { Authorization: `Bearer ${authToken}` }, }
    );
    return data;
};

export const usePaymentCheckout = (paymentId: string | null) => {
    return useQuery({
        queryKey: ['payment-checkout', paymentId],
        queryFn: () => fetchPaymentCheckout(paymentId!),
        enabled: !!paymentId,
    });
};
