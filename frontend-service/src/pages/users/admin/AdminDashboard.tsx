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
  ShieldUser,
} from 'lucide-react';
import AdminLayout from './AdminLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const restaurantBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Restaurant Signups',
        data: [10, 15, 22, 18],
        backgroundColor: '#22c55e',
        borderRadius: 6,
      },
    ],
  };

  const driverBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Driver Signups',
        data: [8, 12, 16, 14],
        backgroundColor: '#f97316',
        borderRadius: 6,
      },
    ],
  };

  const topRestaurants = [
    { name: 'Spicy Spoon', signups: 342 },
    { name: 'Green Leaf', signups: 298 },
    { name: 'Urban Dine', signups: 265 },
    { name: 'Flavor House', signups: 234 },
    { name: 'Ocean Bites', signups: 198 },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* First Row - Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Users className="mx-auto text-blue-500 mb-2" />
            <p className="text-sm text-neutral-500">Total Users</p>
            <h3 className="text-2xl font-bold text-blue-600">5,421</h3>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <UserRoundPen className="mx-auto text-indigo-500 mb-2" />
            <p className="text-sm text-neutral-500">Total Customers</p>
            <h3 className="text-2xl font-bold text-indigo-600">4,582</h3>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <UtensilsCrossed className="mx-auto text-green-500 mb-2" />
            <p className="text-sm text-neutral-500">Total Restaurants</p>
            <h3 className="text-2xl font-bold text-green-600">312</h3>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <Truck className="mx-auto text-orange-500 mb-2" />
            <p className="text-sm text-neutral-500">Total Drivers</p>
            <h3 className="text-2xl font-bold text-orange-500">87</h3>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <ShieldUser className="mx-auto text-red-500 mb-2" />
            <p className="text-sm text-neutral-500">Total Admins</p>
            <h3 className="text-2xl font-bold text-red-500">3</h3>
          </div>
        </div>

        {/* Second Row - Restaurant Graph + Top Restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Top Restaurants</h2>
            <div className="divide-y divide-neutral-200">
              {topRestaurants.map((res, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-800">{res.name}</h3>
                    <p className="text-xs text-neutral-500">{res.signups} Orders</p>
                  </div>
                  <ArrowUpRight className="text-green-500" size={18} />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs text-primary font-semibold hover:text-primary/80">
              View All Restaurants
            </button>
          </div>  

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Restaurant Signups Overview</h2>
              <select className="text-xs border border-neutral-300 rounded px-2 py-1">
                <option>This Year</option>
                <option>This Month</option>
              </select>
            </div>
            <Bar data={restaurantBarData} height={120} />
          </div>
        </div>

        {/* third Row - Restaurant Graph + Top Restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">

        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Driver Signups Overview</h2>
              <select className="text-xs border border-neutral-300 rounded px-2 py-1">
                <option>This Year</option>
                <option>This Month</option>
              </select>
            </div>
            <Bar data={driverBarData} height={120} />
          </div>

            

            <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Top Drivers</h2>
                <div className="divide-y divide-neutral-200">
                {topRestaurants.map((res, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-800">{res.name}</h3>
                        <p className="text-xs text-neutral-500">{res.signups} Orders</p>
                    </div>
                    <ArrowUpRight className="text-green-500" size={18} />
                    </div>
                ))}
                </div>
                <button className="w-full mt-4 text-xs text-primary font-semibold hover:text-primary/80">
                View All Restaurants
                </button>
            </div>
          </div>


      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
