import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { sanitizeInput } from "../utils/sanitize";
import styles from "./LoginPage.module.css"

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
        
        const cleanEmail = sanitizeInput(email);
        const cleanPassword = sanitizeInput(password)

        const result = await login(cleanEmail, cleanPassword);

        if (!result.success) {
            setAuthError(result.error);
            setIsLoggingOn(false);
        } 
    }

    return (
        <div className={styles.loginPage}>
            <form onSubmit={handleSubmit}>
                {authError && <div className="authError">{authError}</div>}
                <div className={styles.inputGroup}>
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoggingOn}
                        maxLength={254}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor='password'>Password</label>
                    <input
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoggingOn}
                        maxLength={128}
                    />
                </div>
                <button type="submit" className="btnLogin" disabled={isLoggingOn}>
                    {isLoggingOn ? 'Logging on...' : 'Logon'}
                </button>
            </form>
        </div>
    );
}