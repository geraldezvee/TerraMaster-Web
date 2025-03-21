import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import UserApproval from "./components/UserApproval.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import logo from "./assets/images/Logo.png";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => JSON.parse(localStorage.getItem("isSidebarOpen")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <UpdateTitleAndFavicon />
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      ) : (
        <div className="flex h-screen">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
          />
          <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-20"}`}>
            <PageContent />
          </div>
        </div>
      )}
    </Router>
  );
}

function UpdateTitleAndFavicon() {
  const location = useLocation();

  useEffect(() => {
    let pageTitle = "TerraMaster Hub";
    if (location.pathname !== "/") {
      const formattedTitle = location.pathname.replace("/", "").replace("-", " ");
      pageTitle = `TerraMaster Hub - ${formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1)}`;
    }
    document.title = pageTitle;

    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = logo;
  }, [location.pathname]);

  return null;
}

// ✅ Ensures Dashboard is the first page after login
function PageContent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user-approval" element={<UserApproval />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
