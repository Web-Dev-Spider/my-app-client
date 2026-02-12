import React from 'react'
import { useAuth } from '../context/AuthContext'

function Welcome() {
    const { isAuthenticated, user, agency } = useAuth()

    return (
        <div className="min-h-[88vh] flex flex-col justify-center items-center
                        bg-theme-primary text-center px-4 transition-colors duration-300">
            {agency && (<h3 className="text-xl md:text-2xl mb-4 text-theme-secondary">
                Agency:
                <span className="ml-2 font-semibold text-theme-primary">
                    {agency?.name || "—"}
                </span>
            </h3>)}


            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-theme-primary">
                Welcome{" "}
                {isAuthenticated ? (
                    <span className="text-theme-secondary">
                        {user?.role}
                    </span>
                ) : (
                    <span className="text-theme-secondary opacity-70">
                        Guest
                    </span>
                )}
            </h1>

        </div>
    )
}

export default Welcome