import { Box, Typography, Stack, Divider } from '@mui/material';
import { IItem } from '../api/useGetCartItems';

interface CartItemListProps {
    items: IItem[];
}

export const CartItemList = ({ items }: CartItemListProps) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            <Stack divider={<Divider />} spacing={2}>
                {items.map((item) => (
                    <Box
                        key={item.name}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Quantity: {item.quantity}
                            </Typography>
                        </Box>
                        <Typography variant="body1">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};
