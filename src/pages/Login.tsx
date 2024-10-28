import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Stack, TextField, Button } from '@mui/material';
import axios from 'axios';

export const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const initialValues = { email: '', password: '' };
    const [formValues, setFormValues] = useState(initialValues);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${apiUrl}/users/login`,
                formValues
            );
            console.log('response.data: ', response.data);
            setSuccess('Login successful!');
            setError(null);
        } catch (err) {
            console.log('catched error: ', err);
            let messageError;
            if (
                axios.isAxiosError(err) &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                messageError = err.response.data.message;
            } else {
                messageError = 'An error occurred while logging in.';
            }
            setError(messageError);
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
                {error && (
                    <Typography color='error'>
                        {Array.isArray(error) ? error.join(', ') : error}
                    </Typography>
                )}
                {success && (
                    <Typography color='success.main'>{success}</Typography>
                )}
                <TextField
                    label='Email'
                    variant='outlined'
                    required
                    name='email'
                    value={formValues.email}
                    onChange={handleChange}
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
