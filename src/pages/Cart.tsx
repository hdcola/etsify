import {
    Typography,
    Stack,
    Card,
    CardMedia,
    Avatar,
    Box,
    Button,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import NumberCounter from '../components/NumberCounter';
import useCartCount from '../hooks/useCartCount';

const CartItem = ({ refreshCart, removeItem, itemData }: Props) => {
    const { server } = useAppContext();
    const [item] = useState<IItem>(itemData);
    const [quantity, setQuantity] = useState<number>(item.carts_items.quantity);

    const { refetch } = useQuery({
        queryKey: ['quantity'],
        queryFn: () => {
            return axios
                .patch(
                    `${server.apiUrl}/api/carts/${item.item_id}`,
                    { quantity: quantity },
                    { headers: { Authorization: `Bearer ${server.authToken}` } }
                )
                .then((res) => {
                    if (res.status === 200) {
                        refreshCart();
                    }
                    return quantity;
                });
        },
        enabled: false,
    });

    useEffect(() => {
        refetch();
    }, [quantity]);

    return (
        <Card key={item.item_id} sx={{ padding: 2 }} variant="outlined">
            <Typography display={'inline-flex'} component="div" mb={1}>
                <Avatar
                    children="SN"
                    sx={{
                        width: 30,
                        height: 30,
                        marginInlineEnd: 2,
                    }}
                    variant="rounded"
                />
                {item.store.name}
            </Typography>
            <Stack spacing={2} direction="row">
                <Link to={`/items/${item.item_id}`}>
                    <CardMedia
                        component="img"
                        sx={{
                            height: {
                                xs: 100,
                                md: 150,
                            },
                            objectFit: 'contain',
                        }}
                        image={item.image_url}
                    />
                </Link>
                <Stack flexGrow={1} spacing={2} rowGap={1} px={1}>
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Link to={`/items/${item.item_id}`}>
                            <Typography
                                noWrap
                                sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                }}
                            >
                                {item.name}
                            </Typography>
                        </Link>
                    </Box>
                    <Stack textAlign={'right'} mt={3}>
                        <Typography fontWeight={'bold'} fontSize={'1.2rem'}>
                            CA${(item.price * quantity).toFixed(2)}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent={'space-between'}
                    >
                        <Button
                            color="error"
                            size="small"
                            variant="outlined"
                            onClick={() => removeItem(item.item_id)}
                        >
                            Remove
                        </Button>
                        <NumberCounter
                            min={1}
                            max={item.quantity}
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
};

const Cart = () => {
    const { isInit, server, setCartCount } = useAppContext();
    const [items, setItems] = useState<IItem[]>([]);
    const [checkout, setCheckout] = useState<ICheckout>({} as ICheckout);
    useCartCount();

    const { refetch } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            return axios
                .get(`${server.apiUrl}/api/carts`, {
                    headers: { Authorization: `Bearer ${server.authToken}` },
                })
                .then((res) => {
                    if (res.status === 200) {
                        setItems(res.data.items);
                        setCheckout(res.data.checkout);
                        return res.data;
                    }
                    return items;
                });
        },
        enabled: isInit,
    });

    const handleRemove = (itemId: number) => {
        axios
            .delete(`${server.apiUrl}/api/carts/${itemId}`, {
                headers: { Authorization: `Bearer ${server.authToken}` },
            })
            .then((res) => {
                if (res.status === 204) {
                    const newItems = items.filter(
                        (item) => item.item_id !== itemId
                    );
                    setItems(newItems);
                    setCartCount((prev: number) => prev - 1);
                    refetch();
                }
            });
    };

    return (
        <>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box px={2}>
                        <Typography variant="h5" mb={2} pl={2}>
                            Your cart
                        </Typography>
                        <Stack spacing={2}>
                            {items.map((item) => {
                                return (
                                    <CartItem
                                        key={item.item_id}
                                        itemData={item}
                                        removeItem={handleRemove}
                                        refreshCart={refetch}
                                    />
                                );
                            })}
                        </Stack>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box padding={3} mx={1}>
                        <Stack spacing={1} mb={3}>
                            {/* Items total */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1">
                                    Item(s) total
                                </Typography>
                                <Typography variant="body1">
                                    CA${checkout.itemsTotal}
                                </Typography>
                            </Stack>
                            {/* Shop discount */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1">
                                    Shop discount
                                </Typography>
                                <Typography variant="body1">
                                    - CA${checkout.shopDiscount}
                                </Typography>
                            </Stack>
                            <Divider />
                            {/* Subtotal */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1">
                                    Subtotal
                                </Typography>
                                <Typography variant="body1">
                                    CA${checkout.subtotal}
                                </Typography>
                            </Stack>
                            {/* Shipping */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1">
                                    Shipping
                                </Typography>
                                <Typography variant="body1">
                                    CA${checkout.shipping}
                                </Typography>
                            </Stack>
                            <Divider />
                            {/* Total */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography fontWeight={'bold'}>
                                    Total ({items.length} items)
                                </Typography>
                                <Typography variant="body1" fontWeight={'bold'}>
                                    CA${checkout.total}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                borderRadius: 50,
                            }}
                        >
                            Checkout
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

interface Props {
    itemData: IItem;
    removeItem: Function;
    refreshCart: Function;
}

interface IItem {
    item_id: number;
    image_url?: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    store: IStore;
    carts_items: ICartsItems;
}

interface ICartsItems {
    quantity: number;
    discount_percent: number | null;
}

interface IStore {
    store_id: number;
    name: string;
    description?: string;
    rating: number;
    logo_url?: string;
    image_url?: string;
    country: ICountry;
}

interface ICountry {
    country_id: number;
    name: string;
    code: string;
}

interface ICheckout {
    itemsTotal: number;
    shopDiscount: number;
    subtotal: number;
    shipping: number;
    total: number;
}

export default Cart;
