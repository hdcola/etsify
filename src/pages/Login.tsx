import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Stack, TextField, Button } from '@mui/material';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const initialValues = { email: '', password: '' };
    const [formValues, setFormValues] = useState(initialValues);
    const [error, setError] = useState<{ [key: string]: string | null }>({});
    const [success, setSuccess] = useState<string | null>(null);
    // const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors: { [key: string]: string } = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
            newErrors.email = 'Please provide a valid email.';
            return;
        }

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            return;
        }

        try {
            await axios.post(`${apiUrl}/api/users/login`, formValues);
            setSuccess('Login successful!');
            setTimeout(() => {
                setSuccess('');
                // navigate('/');
            }, 1000);
            setError({});
        } catch (err) {
            let messageError = 'An error occurred while logging in.';
            if (axios.isAxiosError(err)) {
                messageError =
                    err.response?.data?.message || 'An error occurred.';
            }
            setError({ general: messageError });
            setSuccess(null);
        }
    };

    return (
        <Stack
            component='form'
            onSubmit={handleSubmit}
            spacing={4}
            paddingX={3}
            paddingY={5}
            direction='row'
            justifyContent='center'
            sx={{
                marginTop: '100px',
                marginX: 'auto',
                width: { xs: '100%', sm: '450px' },
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <Stack spacing={3}>
                <Typography variant='h4' component='h1'>
                    Login form
                </Typography>
                {success && (
                    <Typography color='success.main'>{success}</Typography>
                )}
                {error.general && (
                    <Typography color='error'>{error.general}</Typography>
                )}
                <TextField
                    label='Email'
                    variant='outlined'
                    required
                    name='email'
                    value={formValues.email}
                    onChange={handleChange}
                    helperText={error.email}
                    error={!!error.email}
                />
                <TextField
                    label='Password'
                    type='password'
                    required
                    name='password'
                    value={formValues.password}
                    onChange={handleChange}
                />
                <Button
                    variant='contained'
                    fullWidth
                    size='medium'
                    type='submit'
                >
                    Login
                </Button>
            </Stack>
        </Stack>
    );
};
