import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { Users, ShieldCheck, AlertCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, DoughnutController);

type User = {
  role: string;
  isApproved: boolean;
  createdAt: string;
};

const AdminAnalytics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3003/api/auth/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const onlyUsers = res.data.filter((user: User) =>
          ['customer', 'restaurantAdmin', 'deliveryPersonnel'].includes(user.role)
        );
        setUsers(onlyUsers);
      } catch (err) {
        console.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Calculations
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const approvalCounts = users.reduce((acc, user) => {
    const key = user.isApproved ? 'Approved' : 'Pending';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlySignups = users.reduce((acc, user) => {
    const month = user.createdAt?.slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyApprovalStats = users.reduce((acc, user) => {
    const month = user.createdAt?.slice(0, 7);
    if (!acc[month]) acc[month] = { Approved: 0, Pending: 0 };
    user.isApproved ? acc[month].Approved++ : acc[month].Pending++;
    return acc;
  }, {} as Record<string, { Approved: number; Pending: number }>);

  //chart data
  const barData = {
    labels: Object.keys(monthlySignups),
    datasets: [
      {
        label: 'User Signups',
        data: Object.values(monthlySignups),
        backgroundColor: '#6366f1',
        borderRadius: 6,
        barThickness: 100,
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        label: 'Roles',
        data: Object.values(roleCounts),
        backgroundColor: ['#22c55e', '#f97316', '#3b82f6'],
      },
    ],
  };

  const approvalBarData = {
    labels: Object.keys(monthlyApprovalStats),
    datasets: [
      {
        label: 'Approved',
        data: Object.values(monthlyApprovalStats).map(m => m.Approved),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Pending',
        data: Object.values(monthlyApprovalStats).map(m => m.Pending),
        backgroundColor: '#facc15',
        borderRadius: 6,
      },
    ],
  };

  const approvalPieData = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        data: [approvalCounts['Approved'] || 0, approvalCounts['Pending'] || 0],
        backgroundColor: ['#16a34a', '#fbbf24'],
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="p-6 font-['Inter']">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">User Analytics</h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white dark:bg-neutral-800 shadow rounded-xl flex items-center gap-4">
                <Users className="text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{users.length}</h3>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-neutral-800 shadow rounded-xl flex items-center gap-4">
                <ShieldCheck className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{approvalCounts['Approved'] || 0}</h3>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-neutral-800 shadow rounded-xl flex items-center gap-4">
                <AlertCircle className="text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{approvalCounts['Pending'] || 0}</h3>
                </div>
              </div>
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">User Signups Over Time</h2>
                <Bar data={barData} height={140} />
              </div>

              <div className="col-span-1 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">User Role Distribution</h2>
                <Doughnut data={doughnutData} />
              </div>

              <div className="col-span-1 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Approval Trends</h2>
                <Bar data={approvalBarData} height={140} />
              </div>

              <div className="col-span-1 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Approval Status Ratio</h2>
                <Doughnut data={approvalPieData} />
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
