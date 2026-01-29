import React from 'react'
import { Navigate } from 'react-router-dom';

function Dashboard() {
    const isAuthenticated = true; // mock auth


    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }


    return (
        <div className="p-10 text-center">
            <h2 className="text-3xl font-bold">Dashboard (Protected)</h2>
        </div>
    );
}

export default Dashboard
