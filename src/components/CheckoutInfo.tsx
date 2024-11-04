import { Stack, Typography, Divider } from '@mui/material';
import { ICheckout } from '../api/useGetCartItems';

export const CheckoutInfo = ({
    checkout,
    itemsCount,
}: {
    checkout: ICheckout | undefined;
    itemsCount: number;
}) => {
    return (
        <Stack spacing={1}>
            {/* Items total */}
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Item(s) total</Typography>
                <Typography variant="body1">
                    CA${checkout?.itemsTotal}
                </Typography>
            </Stack>
            {/* Shop discount */}
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Shop discount</Typography>
                <Typography variant="body1">
                    - CA${checkout?.shopDiscount}
                </Typography>
            </Stack>
            <Divider />
            {/* Subtotal */}
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">CA${checkout?.subtotal}</Typography>
            </Stack>
            {/* Shipping */}
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">CA${checkout?.shipping}</Typography>
            </Stack>
            <Divider />
            {/* Total */}
            <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={'bold'}>
                    Total ({itemsCount} items)
                </Typography>
                <Typography variant="body1" fontWeight={'bold'}>
                    CA${checkout?.total}
                </Typography>
            </Stack>
        </Stack>
    );
};
