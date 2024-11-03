import { useAppContext } from "../App";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function useCartCount() {
    const { server, isInit, setCartCount } = useAppContext();

    useQuery({
        queryKey: ['cartCount'],
        queryFn: async () => {
            if (server.authToken !== null) {
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
        },
        enabled: isInit
    });
}

export default useCartCount;