import {useState} from 'react';
import { Stack, Box } from '@mui/material';
import SideNav from '../components/Dashboard/SideNav';
import ManageItems from '../components/Dashboard/ManageItems';
import ManageOrders from '../components/Dashboard/ManageOrders';
import DashboardMain from '../components/Dashboard/DashboardMain';

export const StoreDashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState('dashboard');

    const renderContent = () => {
        switch (selectedComponent) {
            case 'items':
                return <ManageItems />;
            case 'orders':
                return <ManageOrders />;
            default:
                return <DashboardMain />;
        }
    };

    return (
        <Stack sx={{ width: '100vw', height: '100vh' }}>
            <SideNav setSelectedComponent={setSelectedComponent} />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {renderContent()}
            </Box>
        </Stack>
    );
};
