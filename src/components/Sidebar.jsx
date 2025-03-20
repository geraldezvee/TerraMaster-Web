import { useState, useEffect, useRef } from "react";
import {
  Menu,
  LogOut,
  UserCheck,
  Settings,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import logo from "../assets/images/Logo.png";
import "../index.css";

export default function Sidebar({
  setActive,
  active,
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sidebarRef = useRef(null);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);

      // Auto-toggle sidebar based on screen size
      if (!isNowMobile && !isSidebarOpen) setIsSidebarOpen(true);
      if (isNowMobile && isSidebarOpen) setIsSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, setIsSidebarOpen]);

  // Handle Click Outside to Close Sidebar (Mobile Only)
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
  }, [isMobile, isSidebarOpen, setIsSidebarOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "User Approval", icon: <UserCheck size={18} /> },
    { name: "Profile", icon: <Settings size={18} /> },
  ];

  const handleItemClick = (name) => {
    setActive(name);
    if (isMobile) setIsSidebarOpen(false); // Auto-close on mobile
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);

    // Simulating a delay before logout to show animation
    setTimeout(async () => {
      await handleLogout();
      setIsLoggingOut(false);
    }, 1500); // 1.5s delay for animation
  };

  return (
    <>
      {/* Full-Screen Logout Loading Overlay */}
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
        className={`h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 bg-[#F5EFE6] p-4 shadow-lg z-50 font-inter ${
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

        {/* Logo - Adjusts size dynamically */}
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
            <li
              key={item.name}
              className={`flex items-center gap-4 p-3 rounded-md cursor-pointer transition-all ease-in-out duration-300 ${
                active === item.name
                  ? "bg-yellow-900 text-white"
                  : "text-gray-800"
              } font-inter`}
              onClick={() => handleItemClick(item.name)}
            >
              {item.icon}
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
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
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
            {isSidebarOpen && (
              <span className="font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
