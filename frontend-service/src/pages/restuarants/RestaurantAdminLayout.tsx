import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  BarChart2,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// Define props type with children
interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState({ name: "Admin", lastName: "User" });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsSidebarOpen(!isNowMobile);
    };

    // Read user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    navigate("/login/restaurant");
  };

  const navigation = [
    {
      name: "Restaurant Details",
      href: "/restaurant-dash",
      icon: LayoutDashboard,
    },
    { name: "Menu Items", href: "/admin/customers", icon: UtensilsCrossed },
    { name: "Orders", href: "/admin/restaurants", icon: ShoppingCart },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-neutral-500"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* <Link to="/restaurant-dash" className="text-xl font-bold text-primary">
            Restaurant Admin
          </Link> */}
          {/* <Bell className="text-neutral-500" size={20} /> */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-neutral-700 hover:text-neutral-900"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <Link
              to="/restaurant-dash"
              className="text-xl font-bold text-primary"
            >
              {user?.name}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-700 hover:bg-neutral-100"
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
                <div className="font-medium text-neutral-900">
                  {user?.name} 
                </div>
                <div className="text-xs text-neutral-500">Restaurant Admin</div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-64 right-0 z-30 h-16 items-center justify-between bg-white border-b border-neutral-200 px-6">
        <div className="text-lg font-semibold text-neutral-700">
          {/* {navigation.find((nav) => nav.href === location.pathname)?.name || ""} */}
        </div>
        <div className="flex items-center gap-4">
          {/* <Bell className="text-neutral-500" size={20} /> */}
          <Link
            to="/restaurant-dash"
            className="text-xl font-bold text-primary"
          >
            Logout
          </Link>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-neutral-700 hover:text-neutral-900"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 md:pt-16 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        } p-4`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
