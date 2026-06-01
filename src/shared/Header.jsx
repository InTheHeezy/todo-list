import { useAuth } from "../contexts/AuthContext"
import { Logoff } from "../features/LogOff";

export default function Header() {

    const { isAuthenticated } = useAuth();
    
    return (
        <header>
            <h1>Todo List</h1>

            {isAuthenticated && <Logoff />}
        </header>
    )
}