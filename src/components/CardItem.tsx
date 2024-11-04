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

interface Props {
    cardData: IItem;
}

interface IItem {
    item_id: number;
    image_url?: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    store: IStore;
}

interface IStore {
    store_id: number;
    name: string;
    rating: number;
    logo_url: string;
}

const CardItem = ({ cardData }: Props) => {
    console.log('hellooooo');
    return (
        <Box position={'relative'} width={275} height={275}>
            <FavoriteFab
                itemId={cardData.item_id}
                favorite={true}
                size="small"
            />
            <Card
                variant="outlined"
                sx={{
                    ':hover': { boxShadow: 1 },
                    positon: 'relative',
                    borderColor: '#eeeeee',
                }}
            >
                <Link to={`/items/${cardData.item_id}`}>
                    <CardMedia
                        sx={{ height: 150 }}
                        image={cardData.image_url}
                    />
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

export default CardItem;
