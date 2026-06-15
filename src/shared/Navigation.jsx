import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function navLinkStyle ({ isActive }) {
    return {
        fontWeight: isActive ? "bold" : "normal",
        textDecoration: isActive ? "underline" : "none"
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
        <nav className="nav-links"> 
            <ul>
                <li>
                    <NavLink to="/about">About</NavLink>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos">Todos</NavLink>    
                        </li>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                      <NavLink to="/login">Login</NavLink>  
                    </li>
                )}
            </ul>
        </nav>
    )
}