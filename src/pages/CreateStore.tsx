import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import {
    Stack,
    TextField,
    Button,
    MenuItem,
    Select,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    FormHelperText,
    SelectChangeEvent,
    InputLabel,
} from '@mui/material';
import axios from 'axios';
import * as yup from 'yup';

// TODO: connect to countries table to fetch countries in Select
export const CreateStore = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const initialValues = {
        country_id: '',
        name: '',
        description: '',
    };
    const schema = yup.object().shape({
        country_id: yup.string().required('Country is Required!'),
        name: yup.string().required('Store name is Required!'),
    });

    const [formValues, setFormValues] = useState(initialValues);
    const [countries, setCountries] = useState<{ country_id: string; name: string; }[]>([]);
    const [error, setError] = useState<{ [key: string]: string | null }>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Store Preferences', 'Store Details'];

    const handleSelect = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: null }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: null }));
    };

    const handleNext = () => {
        if (activeStep === 0 && !formValues.country_id) {
            setError({ country_id: 'Please select a country.' });
            return;
        }
        if (activeStep === 1 && !formValues.name) {
            setError({ name: 'Please provide a store name.' });
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        try {
            await schema.validate(formValues, { abortEarly: false });
            await axios.post(`${apiUrl}/api/store/`, formValues);
            setSuccess('Store created successfully!');
            setError({});
        } catch (err) {
            console.log(err);
            let messageError = 'An error occurred while creating the store.';
            if (axios.isAxiosError(err)) {
                messageError =
                    err.response?.data?.message || messageError;
            }
            setError({ general: messageError });
            setSuccess(null);
        }
    };
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/countries`);
                setCountries(response.data.allCountries);
            } catch (error) {
                console.error(error);
                setError({ general: 'Failed to load countries.' });
            }
        };
        loadCountries();
    }, []);

    return (
        <Stack
            spacing={4}
            paddingX={3}
            paddingY={5}
            sx={{
                marginTop: '100px',
                marginX: 'auto',
                width: { xs: '100%', sm: '450px' },
                borderRadius: 4,
            }}
        >
            <Typography variant='h4' component='h1' textAlign='center'>
                Create a New Store
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error.general && (
                <Typography color='error'>{error.general}</Typography>
            )}
            {success && <Typography color='success.main'>{success}</Typography>}

            {activeStep === 0 && (
                <Stack spacing={3}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id='store-country-label'>
                            Store country
                        </InputLabel>
                        <Select
                            labelId='store-country-label'
                            value={formValues.country_id}
                            label='Store country'
                            onChange={handleSelect}
                            name='country_id'
                        >
                            <MenuItem value=''>
                                <em>None</em>
                            </MenuItem>
                            {countries.map((country) => (
                                <MenuItem key={country.country_id} value={country.country_id}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{error.country_id}</FormHelperText>
                    </FormControl>
                </Stack>
            )}

            {activeStep === 1 && (
                <Stack spacing={3}>
                    <Typography>
                        You can draft a name now and change it later. Draw
                        inspiration from what you sell, your style, anything
                        goes.
                    </Typography>
                    <TextField
                        label='Store Name'
                        variant='outlined'
                        required
                        name='name'
                        value={formValues.name}
                        onChange={handleChange}
                        helperText={error.name}
                        error={!!error.name}
                    />
                    <TextField
                        label='Description'
                        variant='outlined'
                        name='description'
                        value={formValues.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        helperText={error.description}
                        error={!!error.description}
                    />
                </Stack>
            )}


            <Stack direction='row' spacing={2} justifyContent='center'>
                {activeStep > 0 && (
                    <Button variant='contained' onClick={handleBack}>
                        Back
                    </Button>
                )}
                {activeStep < steps.length - 1 ? (
                    <Button variant='contained' onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                    <Button variant='contained' onClick={handleSubmit}>
                        Create Store
                    </Button>
                )}
            </Stack>
        </Stack>
    );
};
