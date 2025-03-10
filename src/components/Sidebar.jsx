import { useState, useEffect } from "react";
import { Menu, LogOut, UserCheck, Settings, LayoutDashboard } from "lucide-react";
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "User Approval", icon: <UserCheck size={18} /> },
    { name: "Profile", icon: <Settings size={18} /> },
  ];

  return (
    <div
      className={`h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 bg-[#F5EFE6] p-4 shadow-lg z-50 font-inter ${
        isSidebarOpen ? "w-80" : "w-20"
      }`}
    >
      <button
        className="mb-4 bg-white outline-none p-2 rounded-md self-start"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={17} className="text-yellow-900" />
      </button>

      <div className="flex justify-center items-center mb-6">
        <img
          src={logo}
          alt="Website Logo"
          className="w-40 h-auto object-contain transition-all duration-300"
        />
      </div>

      <ul className="flex flex-col gap-5">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`flex items-center gap-4 p-3 rounded-md cursor-pointer transition-all ease-in-out duration-300 ${
              active === item.name ? "bg-yellow-900 text-white" : "text-gray-800"
            } font-inter`}
            onClick={() => setActive(item.name)}
          >
            {item.icon}
            {isSidebarOpen && <span className="font-medium">{item.name}</span>}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-md cursor-pointer text-gray-800 hover:bg-red-700 ease-in-out duration-300 hover:text-white w-full font-inter"
        >
          <LogOut size={18} />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
