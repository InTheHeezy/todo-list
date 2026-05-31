import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthContext({ children }){

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    //Functions go here...

    const value = {
        email,
        token,
        isAuthenticated: !!token,
        login, 
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}