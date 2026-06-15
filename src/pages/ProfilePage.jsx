import { useEffect, useState } from "react"; // Changed to use useState as requested
import { useAuth } from "../contexts/AuthContext";
import styles from "./ProfilePage.module.css"

export default function ProfilePage() {

    const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { email, token } = useAuth();
    
    useEffect(() => {
        if (!token) return;

        const fetchTodoStats = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/tasks", {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN' : token },
                    credentials: 'include'
                });
                
                if(response.status === 401) throw new Error('Unauthorized');
                if(!response.ok) throw new Error('Failed to fetch profile stats');
                
                const todos = await response.json();
                const todosArray = todos.tasks || [];

                const total = todosArray.length;
                const completed = todosArray.filter((todo) => todo.isCompleted).length;
                const active = total - completed;

                setStats({ total, completed, active });

            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTodoStats();
    }, [token]);

    const completionPercentage = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;

    return (
        <div className={styles.profilePage}>
            <h1>User Profile</h1>
            <section className={styles.profilePageName}>
                <h2>Name: {email}</h2>
                <p>Status: {token ? "Authenticated" : "Not Authenticated"}</p>
            </section>
            
            <section className={styles.profilePageStats}>
                <h2>Todo Stats</h2>
                
                {isLoading && (
                    <div>Loading stats...</div>
                )}
                
                {error && (
                    <div>Error: {error}</div>
                )}
                
                {!isLoading && !error && (
                    <div className={styles.profilePageStats}>
                        <div className={styles.profilePageStats}>
                            <h3>Total</h3>
                            <p>{stats.total}</p>
                        </div>
                        <div className={styles.profilePageStats}>
                            <h3>Active</h3>
                            <p>{stats.active}</p>
                        </div>
                        <div className={styles.profilePageStats}>
                            <h3>Completed</h3>
                            <p>{stats.completed}</p>
                        </div>

                        {stats.total > 0 && (
                            <div className={styles.profilePageStats}>
                                <h3>Completion Rate</h3>
                                <p>{completionPercentage}%</p>
                            </div>
                        )}       
                    </div>
                )}
            </section>
        </div>
    );
}