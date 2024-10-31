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

const SingleItem = () => {
    const id = useParams();
    console.log(id);

    return (
        <Grid container spacing={2}>
            {/* Listing image */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Box display={'flex'} maxHeight={{ xs: 250, sm: 400, md: 500 }}>
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
                            itemId={id.toString()}
                            favorite={false}
                            size="medium"
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'green',
                                objectFit: 'cover',
                            }}
                        >
                            <img
                                src={cardData.img}
                                alt={cardData.name}
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
                        {cardData.quantity > 0 ? 'In stock' : 'Out of stock'}
                    </Typography>
                    <Typography variant="h5" fontWeight={'bold'} gutterBottom>
                        CA${cardData.price}
                    </Typography>
                    <Typography variant="body1" my={2}>
                        {cardData.name}
                    </Typography>
                    <Typography variant="body2">
                        {cardData.description}
                    </Typography>
                    <Stack
                        spacing={1}
                        direction="row"
                        my={2}
                        alignItems={'center'}
                    >
                        <Typography fontSize={'0.9rem'}>
                            {cardData.store.name}
                        </Typography>
                        <Rating
                            name="read-only"
                            value={cardData.store.rating}
                            readOnly
                        />
                    </Stack>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: 50 }}
                    >
                        Add to basket
                    </Button>
                </Box>
            </Grid>
            {/* Reviews */}
            <Grid size={{ xs: 12, md: 8 }} p={2}>
                <Stack spacing={1} direction="row" my={1} alignItems={'center'}>
                    <Typography variant="h6">
                        {reviews.length} reviews
                    </Typography>
                    <Rating name="read-only" value={5} readOnly />
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
                                <Typography variant="body2" fontSize={'0.9rem'}>
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

const cardData = {
    img: 'https://picsum.photos/800/450?random=1',
    name: 'Revolutionizing software development with cutting-edge tools',
    description:
        'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
    price: '10.99',
    quantity: 13,
    store: {
        name: 'Store name',
        rating: 5,
    },
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
