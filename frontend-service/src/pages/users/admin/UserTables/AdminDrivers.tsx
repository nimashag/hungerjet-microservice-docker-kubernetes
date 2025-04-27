import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../AdminLayout';
import { CheckCircle, Trash2, Search, Filter } from 'lucide-react';

type Driver = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isApproved?: boolean;
  role?: string;
};

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3003/api/auth/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const onlyDrivers = res.data.filter((user: Driver) => user.role === 'deliveryPersonnel');
      setDrivers(onlyDrivers);
    } catch (err: any) {
      console.error('Failed to fetch drivers:', err);
      setError('Failed to load delivery drivers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this delivery driver?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3003/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(prev => prev.filter(d => d._id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Approve this delivery driver?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3003/api/auth/${id}`,
        { isApproved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDrivers(prev => prev.map(d => (d._id === id ? { ...d, isApproved: true } : d)));
    } catch {
      alert('Failed to approve user');
    }
  };

  const filteredDrivers = drivers
    .filter(d =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(d => {
      if (approvalFilter === 'approved') return d.isApproved;
      if (approvalFilter === 'pending') return !d.isApproved;
      return true;
    });

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 font-['Inter'] text-gray-800 dark:text-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-4xl font-extrabold">All Delivery Drivers</h1>

          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
              <select
                value={approvalFilter}
                onChange={e => setApprovalFilter(e.target.value as any)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading delivery drivers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">No</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Address</th>
                  <th className="px-6 py-3 text-left">Approved</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredDrivers.map((driver, index) => (
                  <tr key={driver._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{driver.name || '-'}</td>
                    <td className="px-6 py-3">{driver.email || '-'}</td>
                    <td className="px-6 py-3">{driver.phone || '-'}</td>
                    <td className="px-6 py-3">{driver.address || '-'}</td>
                    <td className="px-6 py-3">
                      {driver.isApproved ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <button
                          onClick={() => handleApprove(driver._id)}
                          className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-3 py-1 rounded-full text-xs hover:bg-yellow-200 dark:hover:bg-yellow-700"
                        >
                          Pending
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(driver._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDrivers.length === 0 && (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400">No delivery drivers found.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDrivers;
