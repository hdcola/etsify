import { useQuery } from "@tanstack/react-query";
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

const fetchItems = async (searchQuery: string) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { authToken } = useLoginStore.getState();

    let url = `${apiUrl}/api/items`;
    if (searchQuery !== '') {
        url += `?query=${searchQuery}`
    }

    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 200) {
        return { items: res.data as IItem[] };
    }
    throw new Error('Failed to fetch cart items');
}

const useGetItems = (enabled: boolean, searchQuery: string) => {
    return useQuery({
        queryKey: ['getItems'],
        queryFn: () => fetchItems(searchQuery || ''),
        enabled
    })
}

export default useGetItems;
export type { IItem, IStore };