import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Stack, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const initialValues = {
        username: '',
        full_name: '',
        email: '',
        password: '',
        password2: '',
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues.email)) {
            setError('Please provide a valid email.');
            return;
        }

        if (formValues.password !== formValues.password2) {
            setError("Passwords do not match.");
            setSuccess(null);
            return;
        }

        try {
            await axios.post(`${apiUrl}/users/register`, formValues);
            setSuccess('User registered successfully!');
            setTimeout(() => {
                setSuccess('');
                navigate('/');
            }, 1000);
            setError(null);
        } catch (err) {
            console.log('catched error: ', err);
            let messageError;

            if (axios.isAxiosError(err)) {
                messageError =
                    err.response?.data?.errors?.[0]?.message ||
                    'An error occurred.';
            } else {
                messageError = 'An error occurred while registering.';
            }
            setError(messageError);
            setSuccess(null);
        }
    };

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit}
            spacing={4}
            paddingX={3}
            paddingY={5}
            direction="row"
            justifyContent="center"
            sx={{
                marginTop: "100px",
                marginX: "auto",
                width: { xs: "100%", sm: "450px" },
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <Stack spacing={3}>
                <Typography variant="h4" component="h1">
                    Register a new user
                </Typography>
                {error && (
                    <Typography color="error">
                        {Array.isArray(error) ? error.join(", ") : error}
                    </Typography>
                )}
                {success && (
                    <Typography color="success.main">{success}</Typography>
                )}
                <TextField
                    label="Username"
                    variant="outlined"
                    required
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                />
                <TextField
                    label="Full Name"
                    variant="outlined"
                    required
                    name="full_name"
                    value={formValues.full_name}
                    onChange={handleChange}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    required
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Password"
                    type="password"
                    required
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                />
                <TextField
                    label="Repeat password"
                    type="password"
                    required
                    name="password2"
                    value={formValues.password2}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    fullWidth
                    size="medium"
                    type="submit"
                >
                    Save
                </Button>
            </Stack>
        </Stack>
    );
};
