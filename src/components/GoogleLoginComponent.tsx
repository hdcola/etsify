import {
    GoogleOAuthProvider,
    GoogleLogin,
    CredentialResponse,
} from '@react-oauth/google';

export const GoogleLoginComponent = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log('Google Client ID:', clientId);
    const handleLoginSuccess = (response: CredentialResponse) => {
        console.log('Login Success:', response);
    };

    const handleLoginFailure = () => {
        console.error('Login Failure');
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
