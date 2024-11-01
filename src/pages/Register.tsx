import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Stack, TextField, Button } from '@mui/material';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../store/useLoginStore';

export const Register = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const initialValues = {
        username: '',
        full_name: '',
        email: '',
        password: '',
        password2: '',
    };
    const schema = yup.object().shape({
        username: yup.string().required('username is Required!'),
        full_name: yup.string().required('Your Full Name is Required!'),
        email: yup
            .string()
            .email('Must be a valid email')
            .required('Email is required'),
        password: yup.string().required(), // TODO: add something like this: min(4).max(20)
        password2: yup
            .string()
            .oneOf([yup.ref('password')], "Passwords don't match")
            .required('Please confirm your password'),
    });

    const { login, isLoggedIn } = useLoginStore();

    const [formValues, setFormValues] = useState(initialValues);
    const [error, setError] = useState<{ [key: string]: string | null }>({});
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: null }));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await schema.validate(formValues, { abortEarly: false });
            const response = await axios.post(
                `${apiUrl}/api/users/register`,
                formValues
            );
            login(response.data.token);
            setError({});
            await new Promise((resolve) => setTimeout(resolve, 2000));
            navigate('/');
        } catch (err) {
            let messageError = 'An error occurred while registering.';

            if (axios.isAxiosError(err)) {
                messageError =
                    err.response?.data?.errors?.[0]?.message ||
                    'An error occurred.';
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
                marginTop: '100px',
                marginX: 'auto',
                width: { xs: '100%', sm: '450px' },
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <Stack spacing={3}>
                <Typography variant="h4" component="h1">
                    Register a new user
                </Typography>

                {isLoggedIn && (
                    <Typography color="success.main">
                        User registered successfully!
                    </Typography>
                )}
                {error.general && (
                    <Typography color="error">{error.general}</Typography>
                )}

                <TextField
                    label="Username"
                    variant="outlined"
                    required
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    helperText={error.username}
                    error={!!error.username}
                />
                <TextField
                    label="Full Name"
                    variant="outlined"
                    required
                    name="full_name"
                    value={formValues.full_name}
                    onChange={handleChange}
                    helperText={error.full_name}
                    error={!!error.full_name}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    required
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    helperText={error.email}
                    error={!!error.email}
                />
                <TextField
                    label="Password"
                    type="password"
                    required
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    helperText={error.password}
                    error={!!error.password}
                />
                <TextField
                    label="Repeat password"
                    type="password"
                    required
                    name="password2"
                    value={formValues.password2}
                    onChange={handleChange}
                    helperText={error.password2}
                    error={!!error.password2}
                />
                <Button
                    variant="contained"
                    fullWidth
                    size="medium"
                    type="submit"
                >
                    Register
                </Button>
            </Stack>
        </Stack>
    );
};
