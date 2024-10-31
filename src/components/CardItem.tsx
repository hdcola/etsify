import {
    Card,
    CardMedia,
    CardContent,
    Box,
    Typography,
    Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteFab from './FavoriteFab';

const CardItem = () => {
    return (
        <Box position={'relative'} width={275} height={275}>
            <FavoriteFab itemId={cardData.id} favorite={true} size="small" />
            <Card
                variant="outlined"
                sx={{
                    ':hover': { boxShadow: 1 },
                    positon: 'relative',
                    borderColor: '#eeeeee',
                }}
            >
                <Link to={`/items/${cardData.id}`}>
                    <CardMedia sx={{ height: 150 }} image={cardData.img} />
                    <CardContent>
                        <Typography
                            noWrap
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                        >
                            {cardData.name}
                        </Typography>
                        <Typography
                            fontSize={'0.9rem'}
                            display={'inline-flex'}
                            alignItems={'center'}
                        >
                            {cardData.store.name}
                            <Rating
                                name="read-only"
                                value={cardData.store.rating}
                                size="small"
                                readOnly
                                sx={{
                                    marginInlineStart: '5px',
                                }}
                            />
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={'semibold'}
                            color="green"
                        >
                            CA${cardData.price}
                        </Typography>
                    </CardContent>
                </Link>
            </Card>
        </Box>
    );
};

const cardData = {
    id: 3,
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

export default CardItem;
