import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useLoginStore from '../../store/useLoginStore';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DashboardMain() {
    const { isLoggedIn, authToken } = useLoginStore.getState();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [store, setStore] = useState<{
        name: string;
        description?: string;
        logo_url?: string;
    } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/stores`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log('store response', response);
                if (response.data.success && response.data.store) {
                    setStore(response.data.store);
                }
            } catch (err) {
                console.error('Error fetching store data', err);
            }
        };

        fetchStoreData();
    }, [apiUrl]);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {};
    const navigateCreateStore = async () => {
        navigate('/stores/create');
    };

    const defaultLogoUrl = 'https://etsifybucket.s3.us-east-1.amazonaws.com/default-store-350x350.jpg'; // TODO: add to the .env
    
    return (
        <Grid container spacing={2}>
            {isLoggedIn ? (
                <>
                    {store ? (
                        <>
                            <Card sx={{ display: 'flex', maxWidth: 600 }}>
                            <Stack direction="row" spacing={2}>
                                <CardMedia
                                    component='img'
                                    sx={{ width: 150, height: 150 }}
                                    image={store.logo_url || defaultLogoUrl}
                                    alt=''
                                />
                                </Stack>
                                
                                <CardContent sx={{ flex: 1 }}>
                                    <Grid
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
                                        <IconButton
                                            size='small'
                                            aria-label='edit'
                                            onClick={handleOpen}
                                        >
                                            <EditIcon fontSize='small' />
                                        </IconButton>
                                    </Grid>

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
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    component: 'form',
                                    onSubmit: { handleSubmit },
                                }}
                            >
                                <DialogTitle>
                                    Edit Store Information
                                </DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin='dense'
                                        label='Store Name'
                                        type='text'
                                        value={store.name}
                                        fullWidth
                                        variant='outlined'
                                    />
                                    <TextField
                                        margin='dense'
                                        label='Store Description'
                                        type='text'
                                        value={store.description}
                                        fullWidth
                                        variant='outlined'
                                        multiline
                                        rows={3}
                                    />
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{ mt: 2 }}
                                    >
                                        Logo Image (JPG, GIF, PNG, min
                                        500x500px, max 10 MB)
                                    </Typography>
                                    <Button
                                        variant='contained'
                                        component='label'
                                    >
                                        Upload Logo
                                        <input
                                            type='file'
                                            hidden
                                            accept='.jpg,.gif,.png'
                                        />
                                    </Button>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{ mt: 2 }}
                                    >
                                        Banner Image (JPG, GIF, PNG, 760x100px,
                                        max 2 MB)
                                    </Typography>
                                    <Button
                                        variant='contained'
                                        component='label'
                                    >
                                        Upload Banner
                                        <input
                                            type='file'
                                            hidden
                                            accept='.jpg,.gif,.png'
                                        />
                                    </Button>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={handleClose}
                                    >
                                        Save
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    ) : (
                        <>
                        
                        <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 2 }}>
                            There is no store.
                    </Typography>
                        
                        
                        <Button onClick={navigateCreateStore}>
                            <StorefrontOutlinedIcon fontSize="small" />
                        Sell on etsify
                    </Button>
                    </>
                    )}
                </>
            ) : (
                'Please log in'
            )}
        </Grid>
    );
}
