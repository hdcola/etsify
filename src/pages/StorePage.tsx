import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import {
    Stack,
    Grid2,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import axios from 'axios';

export const StorePage = () => {
    const theme = useTheme();
    const storeId = useParams().id;
    console.log('storeId:', storeId);
    const apiUrl = import.meta.env.VITE_API_URL;
    interface Store {
        store_id: number;
        name: string;
        description: string;
        logo_url: string;
    }
    interface Items {
        item_id: number;
        name: string;
        description: string;
        image_url: string;
    }
    const [store, setStore] = useState<Store | null>(null);
    const [items, setItems] = useState<Items[]>([]);
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/stores/${storeId}`
                );
                console.log(response.data);
                if (response.data.success && response.data.store) {
                    setStore(response.data.store);
                }
            } catch (err) {
                console.error('Error fetching store data', err);
            }
        };
        fetchStoreData();
    }, [apiUrl, storeId]);

    useEffect(() => {
        const fetchItemsForStore = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/api/stores/${storeId}/items`
                );
                console.log(response.data);
                if (response.data.success && response.data.items) {
                    setItems(response.data.items);
                }
            } catch (err) {
                console.error('Error fetching store items', err);
            }
        };
        fetchItemsForStore();
    }, [apiUrl, storeId]);

    const defaultLogoUrl = import.meta.env.VITE_DEFAULT_LOGO_URL;
    return (
        <Stack>
            {/*<Stack sx={{ width: '100%', background: theme.palette.grey[400], pt:5, pb:5 }}>
            </Stack>*/}
            <Stack
                sx={{
                    width: '100%',
                    background: theme.palette.grey[100],
                    pt: 2,
                    pb: 2,
                    mb: 3
                }}
            >
                {store ? (
                    <>
                        <Card sx={{ display: 'flex', maxWidth: 600 }}>
                            <Stack direction='row' spacing={2}>
                                <CardMedia
                                    component='img'
                                    image={store.logo_url || defaultLogoUrl}
                                    alt=''
                                />
                            </Stack>

                            <CardContent sx={{ flex: 1 }}>
                                <Grid2
                                    container
                                    alignItems='center'
                                    justifyContent='space-between'
                                >
                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                    >
                                        Store Name
                                    </Typography>
                                </Grid2>

                                <Typography
                                    gutterBottom
                                    variant='h5'
                                    component='div'
                                >
                                    {store.name}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '10px',
                                        color: 'text.secondary',
                                    }}
                                    variant='caption'
                                    color='text.secondary'
                                    display='block'
                                    gutterBottom
                                >
                                    Store Description
                                </Typography>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                >
                                    {store.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    'Error fetching the store'
                )}
            </Stack>
            <Stack>
                {items.length > 0 ? (
                    <Stack>
                        <Grid2 container spacing={2}>
                            {items.map((item) => (
                                <Grid2 container spacing={2} key={item.item_id}>
                                    <Card sx={{ maxWidth: 400 }}>
                                        <CardMedia
                                            sx={{ height: 250 }}
                                            image={item.image_url}
                                            title={item.name}
                                        />
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant='h5'
                                                component='div'
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {item.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Stack>
                ) : (
                    <Typography variant='body1'>No items found.</Typography>
                )}
            </Stack>
        </Stack>
    );
};
