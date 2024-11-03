import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { useState, createContext, useLayoutEffect, useContext } from 'react';

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
import Cart from './pages/Cart';

import useLoginStore from './store/useLoginStore';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

// Globally pass anything to other files
const AppContext = createContext({} as any);
// Import this in files
export const useAppContext = () => useContext(AppContext);

function App() {
    const theme = useTheme();
    const lessThanXL = useMediaQuery(theme.breakpoints.down('xl'));
    const appearance: { theme: 'stripe' | 'night' | 'flat' | undefined } = {
        theme: 'stripe',
    };
    const loader = 'auto';

    const [isInit, setIsInit] = useState<boolean>(false);
    const [server, setServer] = useState<IServer>({});
    const [cartCount, setCartCount] = useState<number>(0);

    const { authToken, logout, isLoggedIn } = useLoginStore();

    // Use useQuery when making your api request.
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error: { status?: number } | Error | unknown) => {
                if (typeof error === 'object' && error && 'status' in error) {
                    if (error.status === 403) {
                        console.log('<< Unauthorized >>');
                        logout();
                    }
                }
            },
        }),
    });

    // Setup server
    useLayoutEffect(() => {
        if (isLoggedIn) {
            setServer({
                apiUrl: import.meta.env.VITE_API_URL,
                authToken: authToken,
            });
            setIsInit(true);
        } else {
            setCartCount(0);
            setServer({ apiUrl: server.apiUrl });
            setIsInit(false);
        }
    }, [isLoggedIn]);

    return (
        <>
            <CssBaseline />
            <Container sx={{ height: '100%' }} disableGutters={lessThanXL}>
                <AppContext.Provider
                    value={{ isInit, server, cartCount, setCartCount }}
                >
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
                                    <Route path="/cart" element={<Cart />} />
                                    <Route
                                        path="/test"
                                        element={<TestPage />}
                                    />
                                </Routes>
                            </Elements>
                        </Router>
                    </QueryClientProvider>
                </AppContext.Provider>
            </Container>
        </>
    );
}

interface IServer {
    apiUrl?: string;
    authToken?: string;
}

export default App;
