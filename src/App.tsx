import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { loadStripe } from '@stripe/stripe-js';
import './App.css';

import { Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './components/Navbar';
import SingleItem from './pages/SingleItem';
import CssBaseline from '@mui/material/CssBaseline';
import { Register } from './pages/Register';
import { Login } from './pages/Login';

import { Home } from './pages/Home';
import { CheckoutPage } from './pages/CheckoutPage';
import { CompletePage } from './pages/CompletePage';
import { CreateStore } from './pages/CreateStore';
import { StoreDashboard } from './pages/StoreDashboard';
import { Elements } from '@stripe/react-stripe-js';
import { TestPage } from './pages/TestPage';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

function App() {
    const theme = useTheme();
    const lessThanXL = useMediaQuery(theme.breakpoints.down('xl'));
    const queryClient = new QueryClient();
    const appearance: { theme: 'stripe' | 'night' | 'flat' | undefined } = {
        theme: 'stripe',
    };
    const loader = 'auto';

    return (
        <>
            <CssBaseline />
            <Container sx={{ height: '100%' }} disableGutters={lessThanXL}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Navbar />
                        <Elements
                            options={{ appearance, loader }}
                            stripe={stripePromise}
                        >
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/items/:id"
                                    element={<SingleItem />}
                                />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/checkout"
                                    element={<CheckoutPage />}
                                />
                                <Route
                                    path="/complete"
                                    element={<CompletePage />}
                                />
                                <Route
                                    path="/stores/create"
                                    element={<CreateStore />}
                                />
                                <Route
                                    path="/stores/dashboard"
                                    element={<StoreDashboard />}
                                />
                                <Route path="/test" element={<TestPage />} />
                            </Routes>
                        </Elements>
                    </Router>
                </QueryClientProvider>
            </Container>
        </>
    );
}

export default App;
