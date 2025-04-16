import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  UserCheck,
  LayoutDashboard,
  Loader2,
  Library,
  UserRoundPen,
} from "lucide-react";
import logo from "../assets/images/Logo.png";
import "../index.css";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  // ✅ Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      if (newIsMobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Handle Click Outside to Close Sidebar (Mobile Only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "User Approval",
      path: "/user-approval",
      icon: <UserCheck size={18} />,
    },
    {
      name: "Transaction Record",
      path: "/transaction-records",
      icon: <Library size={18} />,
    },
    { name: "Profile", path: "/profile", icon: <UserRoundPen size={18} /> },
  ];

  // ✅ Updated Logout Function
  const handleLogoutClick = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      handleLogout(); // Calls function from App.jsx
      setIsLoggingOut(false);
    }, 1000);
  };

  return (
    <>
      {/* ✅ Logout Loading Screen */}
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 size={32} className="animate-spin text-yellow-900 mb-3" />
            <p className="text-gray-800 font-medium">Logging out...</p>
          </div>
        </div>
      )}

      <div
        ref={sidebarRef}
        className={`h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 bg-yellow-400 p-4 shadow-lg z-50 font-mono ${
          isSidebarOpen ? "w-80" : "w-20"
        }`}
      >
        {/* Sidebar Toggle Button */}
        <button
          className="mb-4 bg-white outline-none p-2 rounded-md self-start"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={20} className="text-yellow-900" />
        </button>

        {/* Logo */}
        <div className="flex justify-center items-center mb-6">
          <img
            src={logo}
            alt="Website Logo"
            className={`object-contain transition-all duration-300 ${
              isSidebarOpen ? "w-40" : "w-10"
            }`}
          />
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col gap-5">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-md cursor-pointer transition-all ease-in-out duration-300 ${
                  location.pathname === item.path
                    ? "bg-yellow-900 text-white"
                    : "text-gray-800"
                } font-inter`}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {item.icon}
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="flex items-center gap-3 p-3 rounded-md cursor-pointer text-gray-800 hover:bg-red-700 ease-in-out duration-300 hover:text-white w-full font-inter disabled:bg-gray-400"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
