import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useLoginStore from '../store/useLoginStore';


interface ICheckout {
    itemsTotal: number;
    shopDiscount: number;
    subtotal: number;
    shipping: number;
    total: number;
}

interface IItem {
    item_id: number;
    image_url?: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    store: IStore;
    carts_items: ICartsItems;
}

interface ICartsItems {
    quantity: number;
    discount_percent: number | null;
}

interface IStore {
    store_id: number;
    name: string;
    description?: string;
    rating: number;
    logo_url?: string;
    image_url?: string;
    country: ICountry;
}

interface ICountry {
    country_id: number;
    name: string;
    code: string;
}

const fetchCartItems = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { authToken } = useLoginStore.getState();

    const res = await axios.get(`${apiUrl}/api/carts`, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 200) {
        return { items: res.data.items as IItem[], checkout: res.data.checkout as ICheckout };
    }
    throw new Error('Failed to fetch cart items');
}

const useGetCartItems = (enabled: boolean) => {
    return useQuery({
        queryKey: ['getCartItems'],
        queryFn: fetchCartItems,
        enabled
    })
}

export default useGetCartItems;
export type { ICheckout, IItem, ICartsItems, IStore, ICountry };