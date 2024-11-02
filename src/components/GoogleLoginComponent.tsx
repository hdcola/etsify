import {
    GoogleOAuthProvider,
    GoogleLogin,
    CredentialResponse,
} from '@react-oauth/google';
import { useGoogleLogin } from '../api/useGoogleLogin';
import useLoginStore from '../store/useLoginStore';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginComponent = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const { mutateAsync } = useGoogleLogin();
    const { login } = useLoginStore();
    const navigate = useNavigate();

    const handleLoginSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            try {
                const data = await mutateAsync(response.credential);
                console.log('Login successful:', data);
                if (data.token) {
                    login(data.token);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    navigate('/');
                } else {
                    console.error('Token is undefined');
                }
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    };

    const handleLoginFailure = () => {
        console.error('Google OAuth Failed');
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
            />
        </GoogleOAuthProvider>
    );
};
