import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    const [authError, setAuthError] = useState('');

    const from = location.state?.from?.pathname || '/todos';

    useEffect(() => {
        if(isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    async function handleSubmit(e) {
        e.preventDefault();

        setAuthError('');
        setIsLoggingOn(true)
        
        const result = await login(email, password);

        if (!result.success) {
            setAuthError(result.error);
            setIsLoggingOn(false);
        } 
    }

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                {authError && <div className="auth-error">{authError}</div>}
                <div className="input-group">
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoggingOn}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor='password'>Password</label>
                    <input
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoggingOn}
                    />
                </div>
                <button type="submit" className="btn-login" disabled={isLoggingOn}>
                    {isLoggingOn ? 'Logging on...' : 'Logon'}
                </button>
            </form>
        </div>
    );
}