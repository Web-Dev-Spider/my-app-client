import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaBuilding, FaUserTag } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-theme-secondary">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-theme-primary transition-colors duration-300 py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-theme-secondary rounded-2xl shadow-lg border border-theme-color overflow-hidden">

                {/* Header / Banner */}
                <div className="bg-theme-accent/10 p-8 text-center border-b border-theme-color">
                    <div className="w-24 h-24 mx-auto bg-theme-accent rounded-full flex items-center justify-center text-4xl text-theme-primary shadow-lg mb-4">
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <h1 className="text-2xl font-bold text-theme-primary">{user.name || 'User Profile'}</h1>
                    <p className="text-theme-secondary font-medium mt-1">{user.role}</p>
                </div>

                {/* Details Grid */}
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-theme-primary mb-6 border-b border-theme-color pb-2">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-theme-tertiary text-theme-accent">
                                <FaUser />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-theme-secondary uppercase tracking-wide">Full Name</p>
                                <p className="text-theme-primary font-medium">{user.name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-theme-tertiary text-theme-accent">
                                <FaUserTag />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-theme-secondary uppercase tracking-wide">Username</p>
                                <p className="text-theme-primary font-medium">{user.username}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-theme-tertiary text-theme-accent">
                                <FaEnvelope />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-theme-secondary uppercase tracking-wide">Email</p>
                                <p className="text-theme-primary font-medium">{user.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-theme-tertiary text-theme-accent">
                                <FaPhone />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-theme-secondary uppercase tracking-wide">Mobile</p>
                                <p className="text-theme-primary font-medium">{user.mobile || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-theme-tertiary text-theme-accent">
                                <FaIdCard />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-theme-secondary uppercase tracking-wide">User ID</p>
                                <p className="text-theme-primary font-medium">{user._id}</p>
                            </div>
                        </div>

                        {(user.agencyId || user.company) && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-theme-tertiary text-theme-accent">
                                    <FaBuilding />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-theme-secondary uppercase tracking-wide">Agency / Company</p>
                                    <p className="text-theme-primary font-medium">
                                        {user.company || (typeof user.agencyId === 'object' ? user.agencyId?.name : user.agencyId) || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
