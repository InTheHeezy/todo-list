import { useAuth } from "../contexts/AuthContext"
import { Logoff } from "../features/LogOff";
import Navigation from "./Navigation";

export default function Header() {

    const { isAuthenticated } = useAuth();
    
    return (
        <header className="main-header">
            <h1 className="logo">Todo List</h1>
            <Navigation />
            {isAuthenticated && <Logoff />}
        </header>
    )
}