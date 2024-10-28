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
    const { data, isLoading, error } = useStripeClientSecret();
    const clientSecret = data?.clientSecret;
    const dpmCheckerLink = data?.dpmCheckerLink;

    const appearance: { theme: 'stripe' | 'night' | 'flat' | undefined } = {
        theme: 'stripe',
    };
    const loader = 'auto';

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        clientSecret && (
            <Elements
                options={{ clientSecret, appearance, loader }}
                stripe={stripePromise}
            >
                <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
            </Elements>
        )
    );
};
