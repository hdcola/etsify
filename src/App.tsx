import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { loadStripe } from '@stripe/stripe-js';
import './App.css';

import { Home } from './pages/Home';
import { CheckoutPage } from './pages/CheckoutPage';
import { CompletePage } from './pages/CompletePage';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/checkout"
                    element={<CheckoutPage stripePromise={stripePromise} />}
                />
                <Route path="/complete" element={<CompletePage />} />
            </Routes>
        </Router>
    );
}

export default App;
