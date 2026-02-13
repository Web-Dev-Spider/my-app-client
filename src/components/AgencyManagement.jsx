import React, { useState, useEffect } from 'react';
import api from '../axios/axiosInstance';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';

const AgencyManagement = () => {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/agencies');
            if (res.data.success) {
                setAgencies(res.data.agencies);
            } else {
                setError("Failed to fetch agencies");
            }
        } catch (err) {
            console.error(err);
            setError("Error loading agencies data");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            // Optimistic update
            setAgencies(prev => prev.map(agency =>
                agency._id === id ? { ...agency, isActive: !currentStatus } : agency
            ));

            const res = await api.put(`/admin/agency/${id}/status`, { isActive: !currentStatus });

            if (!res.data.success) {
                // Revert on failure
                setAgencies(prev => prev.map(agency =>
                    agency._id === id ? { ...agency, isActive: currentStatus } : agency
                ));
                alert("Failed to update status");
            }
        } catch (err) {
            console.error(err);
            // Revert on error
            setAgencies(prev => prev.map(agency =>
                agency._id === id ? { ...agency, isActive: currentStatus } : agency
            ));
            alert("Error updating status");
        }
    };

    const filteredAgencies = agencies.filter(agency =>
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.sapcode?.includes(searchTerm) ||
        agency.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-4 text-center text-theme-secondary">Loading agencies...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-theme-secondary rounded-xl border border-theme-color shadow-sm overflow-hidden">
            <div className="p-6 border-b border-theme-color flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-theme-primary">Distributor Agency Management</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search agencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-1 focus:ring-theme-accent text-sm w-full md:w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-theme-tertiary/50 text-theme-secondary text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Agency Name</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-color">
                        {filteredAgencies.length > 0 ? (
                            filteredAgencies.map((agency) => (
                                <tr key={agency._id} className="hover:bg-theme-tertiary/20 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-theme-primary">
                                        {agency.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-theme-secondary">
                                        <div className="flex flex-col">
                                            <span>{agency.email}</span>
                                            <span className="text-xs opacity-70">SAP: {agency.sapcode || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${agency.company === 'IOCL' ? 'bg-orange-100 text-orange-700' :
                                                agency.company === 'HPCL' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {agency.company}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${agency.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {agency.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                                            {agency.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(agency._id, agency.isActive)}
                                            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors
                                                ${agency.isActive
                                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                    : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                        >
                                            {agency.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-theme-secondary text-sm">
                                    No agencies found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgencyManagement;
