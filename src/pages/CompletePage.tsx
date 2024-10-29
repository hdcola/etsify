import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

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
        <div id="payment-status">
            <div id="status-icon" style={{ backgroundColor: iconColor }}>
                <Icon />
            </div>
            <h2 id="status-text">{text}</h2>

            {intentId && (
                <div id="details-table">
                    <table>
                        <tbody>
                            <tr>
                                <td className="TableLabel">id</td>
                                <td id="intent-id" className="TableContent">
                                    {intentId}
                                </td>
                            </tr>
                            <tr>
                                <td className="TableLabel">status</td>
                                <td id="intent-status" className="TableContent">
                                    {status}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            <div className="flex flex-col">
                {intentId && (
                    <a
                        href={`https://dashboard.stripe.com/payments/${intentId}`}
                        id="view-details"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        View details
                        <OpenInNewOutlinedIcon style={{ paddingLeft: '5px' }} />
                    </a>
                )}
                <a id="retry-button" href="/checkout">
                    Test another
                </a>
            </div>
        </div>
    );
};
