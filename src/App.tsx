import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { Home } from './pages/Home';

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
