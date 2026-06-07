import { useEffect, useState, useReducer } from "react";
import { useAuth } from "../contexts/AuthContext";
import { initialTodoState, TODO_ACTIONS, todoReducer } from "../reducers/todoReducer";

export default function ProfilePage() {
    
    const [state, dispatch]= useReducer(todoReducer, initialTodoState);
    const { user, token } = useAuth();
    
    useEffect(() => {
        if (!token) return;

        const fetchTodoStats = async () => {

            dispatch ({ type: TODO_ACTIONS.FETCH_STATS_START })

            try {
                const response = await fetch("/api/tasks/stats", {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN' : token },
                    credentials: 'include'
                });

                if(!response.ok) throw new Error('Failed to fetch profile stats');
                const data = await response.json();
                dispatch({ type: TODO_ACTIONS.FETCH_STATS_SUCCESS, payload: data });

            } catch (error) {
                dispatch({ type: TODO_ACTIONS.FETCH_STATS_ERROR, payload: error.message })
            }
        }

        fetchTodoStats();
    }, [token]);

    return (
        <div>
            <h1>User Profile</h1>
            <section>
                <h2>{user?.email}</h2>
            </section>
            <section>
                <h2>Todo Stats</h2>
                {state.isStatsLoading && (
                    <div>Loading stats...</div>
                )}
                {state.statsError && (
                    <div>Error: {state.statsError}</div>
                )}
                {!state.isStatsLoading && !state.statsError && (
                    <div>
                        <div>
                            <h3>Total</h3>
                            <p>{state.profileStats.total}</p>
                        </div>
                        <div>
                            <h3>Active</h3>
                            <p>{state.profileStats.active}</p>
                        </div>
                        <div>
                            <h3>Completed</h3>
                            <p>{state.profileStats.completed}</p>
                        </div>        
                    </div>
                    
                )}
            </section>
        </div>
    );
}