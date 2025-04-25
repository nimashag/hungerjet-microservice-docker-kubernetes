import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import RestaurantDashboard from './pages/users/restaurant/RestaurantDashboard';
import MenuItems from "./pages/users/restaurant/MenuItems";
import RestaurantOrders from "./pages/users/restaurant/RestaurantOrdersPage";
import RestaurantAnalytics from "./pages/users/restaurant/RestaurantAnalytics";

import Orders from './pages/Orders';

import LoginCustomer from './pages/users/customer/LoginCustomer';
import LoginAdmin from './pages/users/admin/LoginAdmin';
import LoginDelivery from './pages/users/delivery/LoginDelivery';
import LoginRestaurant from './pages/users/restaurant/LoginRestaurant';

import RegisterCustomer from './pages/users/customer/RegisterCustomer';
import Home from './pages/users/customer/CustomerHome';
import RestaurantList from './pages/users/customer/RestaurantList';
import RestaurantMenu from './pages/users/customer/RestaurantMenu';

import RegisterDelivery from './pages/users/delivery/RegisterDelivery';
import RegisterRestaurant from './pages/users/restaurant/RegisterRestaurant';
import AdminDashboard from './pages/users/admin/AdminDashboard';
import AdminCustomers from './pages/users/admin/UserTables/AdminCustomer';
import AdminRestaurant from './pages/users/admin/UserTables/AdminRestaurant';
import AdminDrivers from './pages/users/admin/UserTables/AdminDrivers';
import AdminAnalytics from './pages/users/admin/AdminAnalytics';

function App() {
    return (
        <BrowserRouter>
        {/* 
            <nav>
                <Link to="/">Restaurants</Link> | <Link to="/orders">Orders</Link>
            </nav>
        */}
            <Routes>

                {/* Restaurant routes */}
                <Route path="/restaurant-dash" element={<RestaurantDashboard />} />
                <Route path="/restaurant-menu" element={<MenuItems />} />
                <Route path="/restaurant-orders" element={<RestaurantOrders />}/>
                <Route path="/restaurant-analytics" element={<RestaurantAnalytics />} />

                {/* Orders routes */}
                <Route path="/orders" element={<Orders />} />

                {/* Login routes */}
                <Route path="/login/customer" element={<LoginCustomer />} />
                <Route path="/login/admin" element={<LoginAdmin />} />
                <Route path="/login/restaurant" element={<LoginRestaurant />} />
                <Route path="/login/delivery" element={<LoginDelivery />} />

                {/* SignUp routes */}
                <Route path="/register/customer" element={<RegisterCustomer />} />
                <Route path="/register/delivery" element={<RegisterDelivery />} />
                <Route path="/register/restaurant" element={<RegisterRestaurant />} />

                {/* Customer Routes */}
                <Route path="/customer-home" element={<Home />} />
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurants/:restaurantId" element={<RestaurantMenu />} />

                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path='/admin/restaurants' element={<AdminRestaurant />} />
                <Route path='/admin/drivers' element={<AdminDrivers />} />
                <Route path='/admin/analytics' element={<AdminAnalytics />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;