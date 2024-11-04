import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useStripeClientSecret } from '../api/useStripeClientSecret';
import { CheckoutForm } from '../components/CheckoutForm';
import useGetCartItems from '../api/useGetCartItems';
import { CheckoutInfo } from '../components/CheckoutInfo';
import { Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CartItemList } from '../components/CartItemList';

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
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Box padding={3}>
                    <Stack spacing={3}>
                        {cartItem && <CartItemList items={cartItem} />}
                        <CheckoutInfo
                            checkout={checkout}
                            itemsCount={cartItem?.length ?? 0}
                        />
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                {clientSecret && (
                    <Elements options={{ clientSecret }} stripe={stripe}>
                        <CheckoutForm />
                    </Elements>
                )}
            </Grid>
        </Grid>
    );
};
