import { useState } from "react";

export function Logon({
    onSetEmail = () => {},
    onSetToken = () => {}
}){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    const [authError, setAuthError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            setIsLoggingOn(true); 
            const response = await fetch('/api/users/logon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
        });  
        const data = await response.json(); 
        if(response.status === 200 && data.name && data.csrfToken) {
            onSetEmail(data.name);
            onSetToken(data.csrfToken);
        }
        if(!response.ok) setAuthError(`Error: ${error.name} | ${error.message}`);
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
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