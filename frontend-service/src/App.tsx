import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';

import LoginCustomer from './pages/users/customer/LoginCustomer';
import LoginAdmin from './pages/users/admin/LoginAdmin';
import LoginDelivery from './pages/users/delivery/LoginDelivery';
import LoginRestaurant from './pages/users/restaurant/LoginRestaurant';

import RegisterCustomer from './pages/users/customer/RegisterCustomer';
import CustomerHome from './pages/users/customer/CustomerHome';
import RegisterDelivery from './pages/users/delivery/RegisterDelivery';
import RegisterRestaurant from './pages/users/restaurant/RegisterRestaurant';

function App() {
    return (
        <BrowserRouter>
        {/* 
            <nav>
                <Link to="/">Restaurants</Link> | <Link to="/orders">Orders</Link>
            </nav>
        */}
            <Routes>
                <Route path="/" element={<Restaurants />} />
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
                <Route path="/customer-home" element={<CustomerHome />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;