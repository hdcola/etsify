import {
    Box,
    Stack,
    Typography,
    Button,
    Rating,
    Link,
    Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';
import FavoriteFab from '../components/FavoriteFab';
import { useAppContext } from '../App';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface IItem {
    item_id: number;
    image_url?: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    store: IStore;
    rating: number;
}

interface IStore {
    store_id: number;
    name: string;
    rating: number;
    logo_url: string;
    country: ICountry;
    user_id: number;
}

interface ICountry {
    country_id: number;
    name: string;
    code: string;
}

const SingleItem = () => {
    const { server, isInit } = useAppContext();
    const params = useParams();
    const navigate = useNavigate();

    const { isLoading, data: item } = useQuery({
        queryKey: ['item'],
        queryFn: async () => {
            return axios
                .get(`${server.apiUrl}/api/items/${params.id}`, {
                    headers: { Authorization: `Bearer ${server.authToken}` },
                })
                .then((res) => {
                    return res.data as IItem;
                });
        },
        enabled: isInit,
    });

    const { refetch } = useQuery({
        queryKey: ['addCart'],
        queryFn: async () => {
            return axios
                .post(`${server.apiUrl}/api/carts/${params.id}`, null, {
                    headers: {
                        Authorization: `Bearer ${server.authToken}`,
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        navigate('/cart');
                    }
                });
        },
        enabled: false,
    });

    const handleClick = () => {
        refetch();
    };

    if (!isLoading && item)
        return (
            <Grid container spacing={2}>
                {/* <p>{data}</p> */}
                {/* Listing image */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box
                        display={'flex'}
                        maxHeight={{ xs: 250, sm: 400, md: 500 }}
                    >
                        {/* <Stack
                        spacing={1}
                        maxWidth={64}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                        <Box sx={{ backgroundColor: 'red' }}>Hello world</Box>
                        <Box sx={{ backgroundColor: 'pink' }}>Hello world</Box>
                    </Stack> */}
                        <Box
                            width={'100%'}
                            position={'relative'}
                            overflow={'hidden'}
                        >
                            <FavoriteFab
                                itemId={item.item_id}
                                favorite={false}
                                size="medium"
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    objectFit: 'cover',
                                }}
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    height={'100%'}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                {/* Listing information */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box p={{ xs: 2, md: 5 }}>
                        <Typography
                            variant="body1"
                            sx={{ textTransform: 'uppercase' }}
                            color="primary"
                        >
                            {item.quantity > 0 ? 'In stock' : 'Out of stock'}
                        </Typography>
                        <Typography
                            variant="h5"
                            fontWeight={'bold'}
                            gutterBottom
                        >
                            CA${item.price}
                        </Typography>
                        <Typography variant="body1" my={2}>
                            {item.name}
                        </Typography>
                        <Typography variant="body2">
                            {item.description}
                        </Typography>
                        <Stack
                            spacing={1}
                            direction="row"
                            my={2}
                            alignItems={'center'}
                            onClick={async () => {
                                navigate(`/stores/${item.store.store_id}`);
                            }}
                        >
                            <Typography
                                fontSize={'0.9rem'}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                {item.store.name}
                            </Typography>
                            <Rating
                                name="read-only"
                                value={item.store.rating}
                                readOnly
                            />
                        </Stack>
                        <Button
                            disabled={item.quantity === 0}
                            onClick={handleClick}
                            variant="contained"
                            fullWidth
                            sx={{ borderRadius: 50 }}
                        >
                            Add to cart
                        </Button>
                    </Box>
                </Grid>
                {/* Reviews */}
                <Grid size={{ xs: 12, md: 8 }} p={2}>
                    <Stack
                        spacing={1}
                        direction="row"
                        my={1}
                        alignItems={'center'}
                    >
                        <Typography variant="h6">
                            {reviews.length} reviews
                        </Typography>
                        <Rating name="read-only" value={item.rating} readOnly />
                    </Stack>

                    {reviews.map((review, index) => {
                        return (
                            <Box key={index} py={2}>
                                <Rating
                                    name="read-only"
                                    value={review.rating}
                                    readOnly
                                />
                                <Typography variant="body1">
                                    {review.description}
                                </Typography>
                                <Stack spacing={1} direction="row">
                                    <Avatar sx={{ height: 20, width: 20 }}>
                                        TP
                                    </Avatar>
                                    <Typography
                                        variant="body2"
                                        fontSize={'0.9rem'}
                                    >
                                        <Link marginInlineEnd={2}>
                                            {review.user.username}
                                        </Link>
                                        {review.date_created}
                                    </Typography>
                                </Stack>
                            </Box>
                        );
                    })}
                </Grid>
            </Grid>
        );
};

const reviews = [
    {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        user: {
            username: 'Username',
        },
        date_created: '2024-10-26',
        rating: 5,
    },
    {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        user: {
            username: 'Username2',
        },
        date_created: '2024-10-28',
        rating: 4,
    },
    {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        user: {
            username: 'Username3',
        },
        date_created: '2024-10-29',
        rating: 5,
    },
    {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        user: {
            username: 'Username4',
        },
        date_created: '2024-10-29',
        rating: 3.5,
    },
];

export default SingleItem;
