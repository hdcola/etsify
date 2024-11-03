import { useAppContext } from "../App";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function useCartCount() {
    const { server, isInit, cartCount, setCartCount } = useAppContext();

    useQuery({
        queryKey: ['cartCount'],
        queryFn: async () => {
            if (server.authToken !== '') {
                return axios.get(`${server.apiUrl}/api/carts/count`, {
                    headers: { Authorization: `Bearer ${server.authToken}` },
                }).then(res => {
                    if (res.status === 200) {
                        setCartCount(res.data);
                        return res.data;
                    }
                });
            }
            else {
                setCartCount(0);
            }
            return cartCount;
        },
        enabled: isInit
    });
}

export default useCartCount;