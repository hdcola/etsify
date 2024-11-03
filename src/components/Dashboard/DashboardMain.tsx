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
import * as yup from 'yup';
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
    const schema = yup.object().shape({
        name: yup.string().required('Store name is required'),
    });
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<{ [key: string]: string | null }>({});
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/stores`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.success && response.data.store) {
                    setStore(response.data.store);
                    setFormValues({
                        name: response.data.store.name,
                        description: response.data.store.description || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching store data', err);
            }
        };
        fetchStoreData();
    }, [apiUrl, authToken]);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setSuccess('');
        setError({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: null }));
    };

    const defaultLogoUrl = import.meta.env.VITE_DEFAULT_LOGO_URL;
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await schema.validate(formValues, { abortEarly: false });
            const formData = new FormData();
            formData.append('name', formValues.name);
            formData.append('description', formValues.description);
    
            if (logoFile) {
                formData.append('file', logoFile);
            }
            const uploadResponse = await axios.post(`${apiUrl}/api/files/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload Response:', uploadResponse.data.url);
            await axios.put(`${apiUrl}/api/stores`, {
                name: formValues.name,
                description: formValues.description,
                logo_url: uploadResponse.data.url, 
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setSuccess('Store updated successfully! Close the window');
            setError({});
            setStore((prevStore) => ({
                ...prevStore,
                name: formValues.name,
                description: formValues.description,
                logo_url: uploadResponse.data.url,
            }));
        } catch (err) {
            let messageError =
                'An error occurred while editing store information.';
            if (axios.isAxiosError(err)) {
                messageError =
                    err.response?.data?.message || 'An error occurred.';
            } else if (err instanceof yup.ValidationError) {
                const validationErrors: { [key: string]: string | null } = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path as string] = error.message;
                });
                setError(validationErrors);
                return;
            }
            setError({ general: messageError });
        }
    };
    const navigateCreateStore = () => navigate('/stores/create');

    return (
        <Grid container spacing={2}>
            {isLoggedIn ? (
                <>
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
                                    onSubmit: handleSubmit,
                                }}
                            >
                                <DialogTitle>
                                    Edit Store Information
                                </DialogTitle>
                                <DialogContent>
                                    {error.general && (
                                        <Typography color='error'>
                                            {error.general}
                                        </Typography>
                                    )}
                                    {success && (
                                        <Typography color='success.main'>
                                            {success}
                                        </Typography>
                                    )}
                                    <TextField
                                        autoFocus
                                        margin='dense'
                                        label='Store Name'
                                        type='text'
                                        name='name'
                                        value={formValues.name}
                                        onChange={handleChange}
                                        error={!!error.name}
                                        helperText={error.name || ''}
                                        fullWidth
                                        variant='outlined'
                                    />
                                    <TextField
                                        margin='dense'
                                        label='Store Description'
                                        type='text'
                                        name='description'
                                        value={formValues.description}
                                        onChange={handleChange}
                                        error={!!error.description}
                                        helperText={error.description || ''}
                                        fullWidth
                                        variant='outlined'
                                        multiline
                                        rows={5}
                                    />
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{ mt: 2 }}
                                    >
                                        Logo Image (JPG, GIF, PNG, max 10 MB)
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
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setLogoFile(
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                        />
                                    </Button>
                                   {/* <Typography
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
                                    </Button>*/}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Close</Button>
                                    <Button variant='contained' type='submit'>
                                        Save
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    ) : (
                        <>
                            {/*<Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ mt: 2 }}
                            >
                                There is no store.
                            </Typography>*/}

                            <Button
                                variant='contained'
                                onClick={navigateCreateStore}
                            >
                                Create a store
                                <StorefrontOutlinedIcon
                                    fontSize='small'
                                    sx={{ ml: 1 }}
                                />
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
