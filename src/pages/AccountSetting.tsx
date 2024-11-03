import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Stack, TextField, Button } from '@mui/material';
import axios from 'axios';
import * as yup from 'yup';
import useLoginStore from '../store/useLoginStore';
import { useUserInfo } from '../api/useUserInfo';
import { useNavigate } from 'react-router-dom';

export const AccountSetting = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { login, userId, authToken } = useLoginStore();
    const { data: userInfo } = useUserInfo(userId);

    const initialValues = {
        username: '',
        full_name: '',
        new_password: '',
        new_password2: '',
    };

    const [formValues, setFormValues] = useState(initialValues);

    React.useEffect(() => {
        if (userInfo) {
            setFormValues((prev) => ({
                ...prev,
                username: userInfo.username,
                full_name: userInfo.full_name,
            }));
        }
    }, [userInfo]);

    const schema = yup.object().shape({
        username: yup.string().required('Username is Required!'),
        full_name: yup.string().required('Your Full Name is Required!'),
        new_password: yup.string(),
        new_password2: yup
            .string()
            .oneOf([yup.ref('new_password')], "Passwords don't match"),
    });

    const [error, setError] = useState<{ [key: string]: string | null }>({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
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
            const response = await axios.put(
                `${apiUrl}/api/users/${userId}`,
                formValues,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            const { token } = response.data;
            login(token);
            setError({});
            setUpdateSuccess(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            navigate('/');
        } catch (err) {
            let messageError = 'An error occurred while updating settings.';

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
                marginTop: '50px',
                marginX: 'auto',
                width: { xs: '100%', sm: '450px' },
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <Stack spacing={3}>
                <Typography variant="h4" component="h1">
                    Account Settings
                </Typography>

                {updateSuccess && (
                    <Typography color="success.main">
                        Settings updated successfully!
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
                    label="New Password"
                    type="password"
                    name="new_password"
                    value={formValues.new_password}
                    onChange={handleChange}
                    helperText={error.new_password}
                    error={!!error.new_password}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    name="new_password2"
                    value={formValues.new_password2}
                    onChange={handleChange}
                    helperText={error.new_password2}
                    error={!!error.new_password2}
                />
                <Button
                    variant="contained"
                    fullWidth
                    size="medium"
                    type="submit"
                >
                    Save Changes
                </Button>
            </Stack>
        </Stack>
    );
};
