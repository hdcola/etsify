import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { combine } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
    id: string
    email: string
    username: string
    full_name: string
    picture: string
}

interface LoginState {
    userId: string
    email: string
    username: string
    full_name: string
    authToken: string
    isLoggedIn: boolean
    picture?: string
}

const initialState: LoginState = {
    userId: '',
    email: '',
    username: '',
    full_name: '',
    authToken: '',
    isLoggedIn: false,
}


const useLoginStore = create(
    devtools(
        persist(
            combine(
                initialState,
                (set) => ({
                    login: (authToken: string) => {
                        const decoded = jwtDecode<DecodedToken>(authToken)
                        set({
                            userId: decoded.id,
                            email: decoded.email,
                            username: decoded.username,
                            full_name: decoded.full_name,
                            authToken,
                            isLoggedIn: true,
                            picture: decoded.picture
                        });
                    },
                    logout: () =>
                        set(initialState)
                })
            ),
            {
                name: 'login-storage',
                storage: createJSONStorage(() => localStorage),
            },
        ),
        { name: 'login-store', enabled: true }
    )
)


export default useLoginStore