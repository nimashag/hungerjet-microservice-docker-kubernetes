import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Truck,
  BarChart2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState({ firstName: 'Admin', lastName: 'User' });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsSidebarOpen(!isNowMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Restaurants", href: "/admin/restaurants", icon: UtensilsCrossed },
    { name: "Drivers", href: "/admin/drivers", icon: Truck },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Approvals", href: "/admin/approvals", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-neutral-500">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-xl font-bold text-primary">HungerJet Admin</Link>
          <Bell className="text-neutral-500" size={20} />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <Link to="/" className="text-xl font-bold text-primary">HungerJet Admin</Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.href ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-neutral-900">{user?.firstName} {user?.lastName}</div>
                <div className="text-xs text-neutral-500">Admin</div>
              </div>
              <button onClick={handleLogout} title="Logout" className="text-neutral-400 hover:text-neutral-600">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} pt-16 md:pt-0`}>
        <header className="hidden md:flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-6">
          <div className="flex items-center">
            <Menu size={20} className="mr-4 cursor-pointer text-neutral-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell size={20} className="text-neutral-500" />
            <button className="flex items-center text-sm text-neutral-700">
              {user?.firstName} {user?.lastName} <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
