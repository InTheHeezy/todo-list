import { useAuth } from "../contexts/AuthContext"

export default function Header() {

    const { isAuthenticated } = useAuth();
    
    return (
        <h1>Todo List</h1>
    )
}