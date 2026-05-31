import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Logon(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    const [authError, setAuthError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError('');
        setIsLoggingOn(true)
        
        if (!result.success) {
            setAuthError(result.error);
            setIsLoggingOn(false);
        } 
    }

    return (
        <div>
            {authError && <div>{authError}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoggingOn}
                    />
                </div>
                <div>
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
                <button type="submit" disabled={isLoggingOn}>
                    {isLoggingOn ? 'Logging on...' : 'Logon'}
                </button>
            </form>
        </div>
    )
}