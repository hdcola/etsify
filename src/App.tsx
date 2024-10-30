import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { Home } from './pages/Home';
import { Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './components/Navbar';
import SingleItem from './pages/SingleItem';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
    const theme = useTheme();
    const lessThanXL = useMediaQuery(theme.breakpoints.down('xl'));
    const queryClient = new QueryClient();

    return (
        <>
            <CssBaseline />
            <Container sx={{ height: '100%' }} disableGutters={lessThanXL}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/items/:id" element={<SingleItem />} />
                        </Routes>
                    </Router>
                </QueryClientProvider>
            </Container>
        </>
    );
}

export default App;
