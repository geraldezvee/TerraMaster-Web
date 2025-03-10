import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import UserApproval from "./components/UserApproval.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import logo from "./assets/images/Logo.png";

export default function App() {
  const [active, setActive] = useState(localStorage.getItem("activePage") || "Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Store authentication status in localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    if (!isAuthenticated) {
      setActive("Dashboard"); // Reset to Dashboard when logged out
    }
  }, [isAuthenticated]);

  // Store active page in localStorage to persist after refresh
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("activePage", active);
    }
  }, [active, isAuthenticated]);

  // Update page title and favicon
  useEffect(() => {
    document.title = active === "Dashboard" ? "TerraMaster Hub" : `TerraMaster Hub - ${active}`;
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = logo;
    }
  }, [active]);

  const renderContent = () => {
    switch (active) {
      case "User Approval":
        return <UserApproval />;
      case "Profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="flex justify-center items-center min-h-screen bg-[#F5EFE6]">
          <Login setIsAuthenticated={setIsAuthenticated} />
        </div>
      ) : (
        <div className="flex h-screen">
          <Sidebar
            setActive={setActive}
            active={active}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
          />

          {isSidebarOpen && !window.matchMedia("(min-width: 768px)").matches && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
            ></div>
          )}

          <div
            className={`flex-1 overflow-auto transition-all duration-300 ${
              isSidebarOpen ? "ml-80" : "ml-20"
            } ${window.innerWidth < 768 && !isSidebarOpen ? "ml-0" : ""}`}
          >
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}
