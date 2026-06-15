import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css"

export default function Navigation(){

    const { isAuthenticated } = useAuth();

    return (
        <nav className={styles.navLinks}> 
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