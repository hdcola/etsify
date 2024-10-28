import { Elements } from '@stripe/react-stripe-js';
import { useStripeClientSecret } from '../api/useStripeClientSecret';
import { CheckoutForm } from '../components/CheckoutForm';
import { Stripe } from '@stripe/stripe-js';

interface CheckoutPageProps {
    stripePromise: Promise<Stripe | null>;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
    stripePromise,
}) => {
    const items = [
        { id: 'M4 MacBook Pro', amount: 20000 },
        { id: 'M1 MacBook Air', amount: 10000 },
    ];

    const { data, isLoading, error } = useStripeClientSecret(items);
    const clientSecret = data?.clientSecret;

    const appearance: { theme: 'stripe' | 'night' | 'flat' | undefined } = {
        theme: 'stripe',
    };
    const loader = 'auto';

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
                <Elements
                    options={{ clientSecret, appearance, loader }}
                    stripe={stripePromise}
                >
                    <CheckoutForm />
                </Elements>
            )}
        </>
    );
};
