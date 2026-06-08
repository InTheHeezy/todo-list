import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export function Logoff() {
    const { logout } = useAuth();
    const [ isLoggingOff, setIsLoggingOff ] = useState(false);
    const [ logOffError, setLogOffError ] = useState('');
    const navigate = useNavigate();

    const handleLogOff = async () => {
        setLogOffError('');
        setIsLoggingOff(true);

        const result = await logout();

        if (!result.success) {
            setLogOffError(result.error);
            setIsLoggingOff(false);
        } else {
            navigate("/login");
            setIsLoggingOff(false);
        }
    };

    return (
            <div>
                <button 
                    onClick={handleLogOff}
                    disabled={isLoggingOff}
                >
                    {isLoggingOff ? 'Logging out' : 'Log out'}    
                </button>
            </div>
        )
}