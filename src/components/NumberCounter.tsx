import { IconButton, Stack, TextField } from '@mui/material';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const NumberCounter = ({ quantity, setQuantity, min, max }: Props) => {
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        let newQuantity = parseInt(event.target.value) || 0;
        if (newQuantity > max) {
            newQuantity = max;
        } else if (newQuantity < min) {
            newQuantity = min;
        }
        setQuantity(newQuantity);
    };

    return (
        <Stack direction="row">
            <IconButton
                disabled={quantity === min}
                onClick={() => setQuantity(Math.max(quantity - 1, min))}
            >
                <RemoveCircleOutlineIcon />
            </IconButton>
            <TextField
                onInput={handleInput}
                value={quantity}
                variant="outlined"
                size="small"
                color="primary"
                sx={{
                    width: 75,
                }}
                slotProps={{
                    htmlInput: {
                        style: {
                            textAlign: 'center',
                        },
                    },
                }}
            />
            <IconButton
                disabled={quantity === max}
                onClick={() => setQuantity(Math.min(quantity + 1, max))}
            >
                <AddCircleOutlineIcon />
            </IconButton>
        </Stack>
    );
};

interface Props {
    min: number;
    max: number;
    quantity: number;
    setQuantity: Dispatch<SetStateAction<number>>;
}

export default NumberCounter;
