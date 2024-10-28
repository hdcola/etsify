import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { loadStripe } from '@stripe/stripe-js';
import './App.css';

import { Container } from '@mui/material';

import { Home } from './pages/Home';
import { CheckoutPage } from './pages/CheckoutPage';
import { CompletePage } from './pages/CompletePage';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

function App() {
    const queryClient = new QueryClient();

    return (
        <Container>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/checkout"
                            element={
                                <CheckoutPage stripePromise={stripePromise} />
                            }
                        />
                        <Route path="/complete" element={<CompletePage />} />
                    </Routes>
                </Router>
            </QueryClientProvider>
        </Container>
    );
}

export default App;
