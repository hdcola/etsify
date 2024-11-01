import * as React from 'react';
import { Stack, Box } from '@mui/material';
import SideNav from '../components/Dashboard/SideNav';
import ManageItems from '../components/Dashboard/ManageItems';
import ManageOrders from '../components/Dashboard/ManageOrders';

export const StoreDashboard = () => {
    const [selectedComponent, setSelectedComponent] = React.useState('dashboard');

    const renderContent = () => {
        switch (selectedComponent) {
            case 'items':
                return <ManageItems />;
            case 'orders':
                return <ManageOrders />;
            default:
                return <div>Dashboard Content</div>;
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