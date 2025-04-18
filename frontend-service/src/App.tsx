import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Restaurants</Link> | <Link to="/orders">Orders</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Restaurants />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;