import { IconButton, Fab } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
/* import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; */

interface Props {
    itemId: string | number;
    favorite: boolean;
    size: 'small' | 'medium' | 'large';
}

const FavoriteFab = (props: Props) => {
    const [itemId, setanItemId] = useState<string | number>(props.itemId);
    const [isFavorite, setIsFavorite] = useState<boolean>(props.favorite);

    const handleClick = async () => {
        console.log(itemId);
        setanItemId(itemId);
        setIsFavorite((prev) => !prev);
    };

    return (
        <IconButton
            onClick={handleClick}
            sx={{
                position: 'absolute',
                right: 5,
                top: 5,
            }}
        >
            <Fab size={props.size}>
                {isFavorite ? (
                    <FavoriteBorderOutlinedIcon
                        fontSize={props.size}
                        color="error"
                    />
                ) : (
                    <FavoriteIcon fontSize={props.size} color="error" />
                )}
            </Fab>
        </IconButton>
    );
};

export default FavoriteFab;
