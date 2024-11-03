import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useStripeClientSecret } from '../api/useStripeClientSecret';
import { CheckoutForm } from '../components/CheckoutForm';
import useGetCartItems from '../api/useGetCartItems';

export const CheckoutPage = () => {
    const { data: { items: cartItem, checkout } = {} } = useGetCartItems(true);
    console.log(cartItem);
    console.log(checkout);

    const items = cartItem
        ? cartItem.map((item) => {
              return {
                  id: item.name,
                  amount: Number(item.price) * item.quantity * 100,
              };
          })
        : [];

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
