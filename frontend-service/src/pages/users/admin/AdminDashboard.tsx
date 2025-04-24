import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Users,
  UtensilsCrossed,
  UserRoundPen,
  Truck,
  ArrowUpRight,
  ShieldUser
} from 'lucide-react';
import AdminLayout from './AdminLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const restaurantBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Restaurant Signups',
      data: [10, 15, 22, 18],
      backgroundColor: '#22c55e',
      borderRadius: 6,
    }],
  };

  const driverBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Driver Signups',
      data: [8, 12, 16, 14],
      backgroundColor: '#f97316',
      borderRadius: 6,
    }],
  };

  const topRestaurants = [
    { name: 'Spicy Spoon', signups: 342 },
    { name: 'Green Leaf', signups: 298 },
    { name: 'Urban Dine', signups: 265 },
    { name: 'Flavor House', signups: 234 },
    { name: 'Ocean Bites', signups: 198 },
  ];

  const stats = [
    {
      label: 'Total Users',
      icon: (
        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-900">
          <Users className="text-blue-500 dark:text-blue-300" />
        </div>
      ),
      color: 'text-blue-500 dark:text-blue-300',
      value: '5,421',
    },
    {
      label: 'Total Customers',
      icon: (
        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900">
          <UserRoundPen className="text-indigo-500 dark:text-indigo-300" />
        </div>
      ),
      color: 'text-indigo-500 dark:text-indigo-300',
      value: '4,582',
    },
    {
      label: 'Total Restaurants',
      icon: (
        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-green-100 dark:bg-green-900">
          <UtensilsCrossed className="text-green-500 dark:text-green-300" />
        </div>
      ),
      color: 'text-green-500 dark:text-green-300',
      value: '312',
    },
    {
      label: 'Total Drivers',
      icon: (
        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-orange-100 dark:bg-orange-900">
          <Truck className="text-orange-500 dark:text-orange-300" />
        </div>
      ),
      color: 'text-orange-500 dark:text-orange-300',
      value: '87',
    },
    {
      label: 'Total Admins',
      icon: (
        <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-red-100 dark:bg-red-900">
          <ShieldUser className="text-red-500 dark:text-red-300" />
        </div>
      ),
      color: 'text-red-500 dark:text-red-300',
      value: '3',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 font-inter text-gray-800 dark:text-gray-100 bg-white dark:bg-neutral-900 transition-all">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md text-center border border-neutral-200 dark:border-neutral-700 transition-all"
            >
              <div className={`mx-auto mb-2 ${item.color}`}>{item.icon}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
              <h3 className={`text-2xl font-bold ${item.color}`}>{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold mb-4">Top Restaurants</h2>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {topRestaurants.map((res, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div>
                    <h3 className="text-sm font-medium">{res.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{res.signups} Orders</p>
                  </div>
                  <ArrowUpRight className="text-green-500 dark:text-green-300" size={18} />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs text-green-600 dark:text-green-400 font-medium hover:underline transition">
              View All Restaurants
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Restaurant Signups Overview</h2>
              <select className="text-xs border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white">
                <option>This Year</option>
                <option>This Month</option>
              </select>
            </div>
            <Bar data={restaurantBarData} height={120} />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Driver Signups Overview</h2>
              <select className="text-xs border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 bg-white dark:bg-neutral-800 text-gray-800 dark:text-white">
                <option>This Year</option>
                <option>This Month</option>
              </select>
            </div>
            <Bar data={driverBarData} height={120} />
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold mb-4">Top Drivers</h2>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {topRestaurants.map((res, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div>
                    <h3 className="text-sm font-medium">{res.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{res.signups} Orders</p>
                  </div>
                  <ArrowUpRight className="text-green-500 dark:text-green-300" size={18} />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs text-green-600 dark:text-green-400 font-medium hover:underline transition">
              View All Drivers
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
