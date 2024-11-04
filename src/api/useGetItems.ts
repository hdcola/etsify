import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../App";
import axios from "axios";
import useLoginStore from "../store/useLoginStore";

interface IItem {
    item_id: number;
    image_url?: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    store: IStore;
}

interface IStore {
    store_id: number;
    name: string;
    rating: number;
    logo_url: string;
}

const fetchItems = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { authToken } = useLoginStore.getState();

    /* return axios.get(`${server.apiUrl}/api/items`, {
        headers: { Authorization: `Bearer ${server.authToken}` },
    }).then((res) => {
        return { items: res.data as IItem[] };
    }).catch((err) => {
        throw new Error('Failed to fetch items');
    }) */
    const res = await axios.get(`${apiUrl}/api/items`, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 200) {
        return { items: res.data as IItem[] };
    }
    throw new Error('Failed to fetch cart items');
}

const useGetItems = (enabled: boolean) => {
    return useQuery({
        queryKey: ['getItems'],
        queryFn: fetchItems,
        enabled
    })
}

export default useGetItems;
export type { IItem, IStore };