import { Fab } from '@mui/material';
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
    const [itemId, setItemId] = useState<string | number>(props.itemId);
    const [isFavorite, setIsFavorite] = useState<boolean>(props.favorite);

    const handleClick = async () => {
        setItemId(itemId);
        setIsFavorite((prev) => !prev);
    };

    return (
        <Fab
            size={props.size}
            onClick={handleClick}
            sx={{
                position: 'absolute',
                right: 5,
                top: 5,
                bgcolor: 'rgba(255, 255, 255, 0.5)',
            }}
        >
            {isFavorite ? (
                <FavoriteBorderOutlinedIcon
                    fontSize={props.size}
                    color="error"
                />
            ) : (
                <FavoriteIcon fontSize={props.size} color="error" />
            )}
        </Fab>
    );
};

export default FavoriteFab;
