import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Checkbox } from '@mui/material';
import axios from 'axios';
import useLoginStore from '../../store/useLoginStore';

export const OrdersTable = () => {
    const { authToken } = useLoginStore();
    const columns: GridColDef[] = [
        { field: 'order_id', headerName: 'Order ID' },
        { field: 'full_name', headerName: 'Full Name' },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{params.value.charAt(0).toUpperCase() + params.value.slice(1)}</span>
                    <Checkbox
                        checked={params.value === 'completed'} 
                        onChange={(event) => {
                            event.stopPropagation();
                            handleStatusChange(params.row); 
                        }}
                    />
                </div>
            ),
        },
        { field: 'total', headerName: 'Total ($)', type: 'number' },
    ];

    interface Order {
        order_id: number;
        full_name: string;
        status: string;
        total: number;
    }

    const paginationModel = { page: 0, pageSize: 5 };
    const [orders, setOrders] = useState<Order[]>([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/orders`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (response.data.success) {
                    setOrders(
                        response.data.orders.map((order: Order) => ({
                            id: order.order_id,
                            ...order,
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [apiUrl, authToken]);

    const handleStatusChange = async (order: Order) => {
        try {
            const newStatus = order.status === 'pending' ? 'completed' : 'pending';
            const response = await axios.put(`${apiUrl}/api/orders/${order.order_id}/status`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                        o.order_id === order.order_id ? { ...o, status: newStatus } : o
                    )
                );
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={orders}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                columnBufferPx='200'
                onCellClick={(params, event) => {
                    if (event.target instanceof HTMLInputElement) {
                        event.stopPropagation();
                    }
                }}
                sx={{ border: 0 }}
            />
        </Paper>
    );
};
