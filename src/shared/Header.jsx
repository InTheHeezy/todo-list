import { useAuth } from "../contexts/AuthContext"
import { Logoff } from "../features/LogOff";
import Navigation from "./Navigation";
import styles from "./Header.module.css"

export default function Header() {

    const { isAuthenticated } = useAuth();
    
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Todo List</h1>
            <Navigation />
            {isAuthenticated && <Logoff />}
        </header>
    )
}