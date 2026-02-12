import React from 'react'
import { useAuth } from '../context/AuthContext'

function Welcome() {
    const { isAuthenticated, user, agency } = useAuth()

    return (
        <div className="min-h-[88vh] flex flex-col justify-center items-center
                        bg-[#ebe9e7] text-center px-4">
            {agency && (<h3 className="text-xl md:text-2xl mb-4 text-[#594c41]">
                Agency:
                <span className="ml-2 font-semibold text-[#312525]">
                    {agency?.name || "—"}
                </span>
            </h3>)}


            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#312525]">
                Welcome{" "}
                {isAuthenticated ? (
                    <span className="text-[#594c41]">
                        {user?.role}
                    </span>
                ) : (
                    <span className="text-[#8a7b70]">
                        Guest
                    </span>
                )}
            </h1>

        </div>
    )
}

export default Welcome