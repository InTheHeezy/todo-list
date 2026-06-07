import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function navLinkStyle ({ isActive }) {
    return {
        fontWeight: isActive ? "bold" : "normal",
        textStyle: isActive ? "underline" : "none"
    };
}

export default function Navigation(){

    const { isAuthenticated } = useAuth();

    const listStyle = {
        listStyle: 'none',
        display: 'flex',
        gap: '1rem',
        padding: 0
    };

    return (
        <nav>
            <ul style={listStyle}>
                <li>
                    <NavLink to="/about" style={navLinkStyle}>About</NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos" style={navLinkStyle}>Todos</NavLink>    
                        </li>
                        <li>
                            <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
                        </li>
                    </>
                ) : (
                    <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
                )}
            </ul>
        </nav>
    )
}