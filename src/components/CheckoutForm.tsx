import { useState, FormEvent } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {
    Box,
    Button,
    Stack,
    Alert,
    Typography,
    CircularProgress,
    Paper,
} from '@mui/material';

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const returnUrl = `${window.location.origin}/complete`;
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Use the dynamically obtained URL prefix
                return_url: returnUrl,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message || 'An unknown error occurred');
        } else {
            setMessage('An unexpected error occurred.');
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: 'tabs' as const, // Explicitly cast to the expected type
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <form id="payment-form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Payment Details
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <PaymentElement
                            id="payment-element"
                            options={paymentElementOptions}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        disabled={isLoading || !stripe || !elements}
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Pay now'
                        )}
                    </Button>

                    {message && (
                        <Alert
                            severity={
                                message.includes('error') ? 'error' : 'info'
                            }
                        >
                            {message}
                        </Alert>
                    )}
                </Stack>
            </form>
        </Paper>
    );
};
