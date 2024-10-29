import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useStripeClientSecret } from '../api/useStripeClientSecret';
import { CheckoutForm } from '../components/CheckoutForm';

export const CheckoutPage = () => {
    const items = [
        { id: 'M4 MacBook Pro', amount: 20000 },
        { id: 'M1 MacBook Air', amount: 10000 },
    ];

    const stripe = useStripe();

    const { data, isLoading, error } = useStripeClientSecret(items);
    const clientSecret = data?.clientSecret;

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            {items.map((item) => (
                <div key={item.id}>
                    <h2>{item.id}</h2>
                    <p>{item.amount / 100}</p>
                </div>
            ))}
            {clientSecret && (
                <Elements options={{ clientSecret }} stripe={stripe}>
                    <CheckoutForm />
                </Elements>
            )}
        </>
    );
};
