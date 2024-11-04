import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Stack,
    Button,
    Box,
    Avatar,
} from '@mui/material';

type StatusKey =
    | 'succeeded'
    | 'processing'
    | 'requires_payment_method'
    | 'default';

type IconType =
    | typeof CheckCircleOutlineIcon
    | typeof ErrorOutlineIcon
    | typeof InfoOutlinedIcon;

const STATUS_CONTENT_MAP: Record<
    StatusKey,
    { text: string; iconColor: string; icon: IconType }
> = {
    succeeded: {
        text: 'Payment succeeded',
        iconColor: '#30B130',
        icon: CheckCircleOutlineIcon,
    },
    processing: {
        text: 'Your payment is processing.',
        iconColor: '#6D6E78',
        icon: InfoOutlinedIcon,
    },
    requires_payment_method: {
        text: 'Your payment was not successful, please try again.',
        iconColor: '#DF1B41',
        icon: ErrorOutlineIcon,
    },
    default: {
        text: 'Something went wrong, please try again.',
        iconColor: '#DF1B41',
        icon: ErrorOutlineIcon,
    },
};

export const CompletePage = () => {
    const stripe = useStripe();

    const [status, setStatus] = useState<StatusKey>('default');
    const [intentId, setIntentId] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                return;
            }

            setStatus(paymentIntent.status.toString() as StatusKey);
            setIntentId(paymentIntent.id);
        });
    }, [stripe]);

    const { icon: Icon, iconColor, text } = STATUS_CONTENT_MAP[status];

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stack spacing={3} alignItems="center">
                    <Avatar
                        sx={{
                            bgcolor: iconColor,
                            width: 56,
                            height: 56,
                        }}
                    >
                        <Icon sx={{ fontSize: 32, color: 'white' }} />
                    </Avatar>

                    <Typography variant="h4" component="h1" textAlign="center">
                        {text}
                    </Typography>

                    {intentId && (
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        component="th"
                                        sx={{
                                            fontWeight: 'bold',
                                            width: '30%',
                                        }}
                                    >
                                        ID
                                    </TableCell>
                                    <TableCell>{intentId}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        component="th"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        sx={{ textTransform: 'capitalize' }}
                                    >
                                        {status}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        {intentId && (
                            <Button
                                variant="outlined"
                                endIcon={<OpenInNewOutlinedIcon />}
                                href={`https://dashboard.stripe.com/payments/${intentId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View details
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            href="/checkout"
                            color="primary"
                        >
                            Test another
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
};
