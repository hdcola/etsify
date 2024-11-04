import CardItem from '../components/CardItem';
import { useAppContext } from '../App';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useGetItems from '../api/useGetItems';
import type { IItem } from '../api/useGetItems';
import { Typography } from '@mui/material';

export const Home = () => {
    const { server, isInit } = useAppContext();
    /*     const [items, setItems] = useState<IItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); */
    //const { isLoading, data: { items } = {} } = useGetItems(isInit);

    /* useEffect(() => {
        console.log('hello?');
        axios
            .get(`${server.apiUrl}/api/items`, {
                headers: { Authorization: `Bearer ${server.authToken}` },
            })
            .then((res) => {
                setItems(res.data);
                console.log('test', res.data);
            })
            .catch((err) => {
                console.log('ERROR');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); */

    const { isLoading, data: items } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            return axios
                .get(`${server.apiUrl}/api/items`, {
                    headers: { Authorization: `Bearer ${server.authToken}` },
                })
                .then((res) => {
                    return res.data;
                });
        },
        enabled: isInit,
    });

    if (isLoading) {
        return <div>Loading</div>;
    }

    /* useEffect(() => {
        axios
            .get<IItem[]>(`${server.apiUrl}/api/items`, {
                headers: { Authorization: `Bearer ${server.authToken}` },
            })
            .then((res) => {
                console.log('test', res.data);
                setItems(res.data);
            });
    }, [isInit]); */

    /* const { isLoading, data: items } = useQuery({
        queryKey: ['getItems'],
        queryFn: async () => {
            return axios.get<IItem[]>(`${server.apiUrl}/api/items`, {
                headers: { Authorization: `Bearer ${server.authToken}` },
            });
        },
        enabled: true,
    }); */

    if (isLoading) return 'Loading....';

    console.log('items', items);

    /* if (isLoading) {
        console.log('hello');
        return (
            <>
                <div>isLoading</div>
            </>
        );
    } */
    console.log('hello2');
    return (
        <>
            <div>
                {items?.map((item: IItem) => {
                    <Typography>{item.name}</Typography>;
                    <CardItem key={item.item_id} cardData={item} />;
                })}
            </div>
        </>
    );
};
