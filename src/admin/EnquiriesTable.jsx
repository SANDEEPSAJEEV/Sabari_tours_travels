import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function EnquiriesTable() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        year: '',
        month: '',
        day: ''
    });

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.year) queryParams.append('year', filters.year);
            if (filters.month) queryParams.append('month', filters.month);
            if (filters.day) queryParams.append('day', filters.day);

            const res = await fetch(`${API_BASE_URL}/api/enquiries?${queryParams.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch enquiries');
            const data = await res.json();
            setEnquiries(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, [filters]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setEnquiries(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({ year: '', month: '', day: '' });
    };

    return (
        <div className="admin-packages-container">
            <div className="admin-header">
                <div>
                    <h2 className="admin-title">User Enquiries & Registrations</h2>
                    <p className="admin-subtitle">Track and manage user interests and registrations.</p>
                </div>
                <button className="reset-btn" onClick={fetchEnquiries}>
                    🔄 Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <div className="search-box">
                    <span className="search-icon">📅 Filter by Date:</span>
                    <select
                        name="year"
                        className="filter-select"
                        value={filters.year}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Years</option>
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        name="month"
                        className="filter-select"
                        value={filters.month}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        name="day"
                        className="filter-select"
                        value={filters.day}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Days</option>
                        {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                    <button className="reset-btn" style={{ marginLeft: '10px' }} onClick={resetFilters}>
                        Clear
                    </button>
                </div>
            </div>

            {error && <div className="error-message">Error: {error}</div>}

            <div className="admin-table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading enquiries...</div>
                ) : enquiries.length === 0 ? (
                    <div className="empty-state">No enquiries found for the selected criteria.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Source</th>
                                <th>Subject</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.map(enquiry => (
                                <tr key={enquiry.id}>
                                    <td>{new Date(enquiry.created_at).toLocaleDateString()}</td>
                                    <td><strong>{enquiry.name}</strong></td>
                                    <td>{enquiry.email}</td>
                                    <td>
                                        <span className={`category-tag ${enquiry.source?.toLowerCase() === 'registration' ? 'kerala' : 'outside'}`}>
                                            {enquiry.source}
                                        </span>
                                    </td>
                                    <td>{enquiry.subject || '-'}</td>
                                    <td>
                                        <button
                                            className="action-btn delete"
                                            title="Delete Enquiry"
                                            onClick={() => handleDelete(enquiry.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .admin-table-wrapper {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    overflow: hidden;
                    margin-top: 20px;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: white;
                }
                .admin-table th, .admin-table td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .admin-table th {
                    background: rgba(255, 255, 255, 0.1);
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                }
                .admin-table tr:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                .filter-select {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    margin-left: 8px;
                    cursor: pointer;
                }
                .filter-select option {
                    background: #1a1a1a;
                }
                .action-btn.delete {
                    background: rgba(255, 71, 71, 0.1);
                    border: 1px solid rgba(255, 71, 71, 0.3);
                    padding: 6px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .action-btn.delete:hover {
                    background: rgba(255, 71, 71, 0.3);
                }
                .empty-state, .loading-state {
                    padding: 40px;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
}
