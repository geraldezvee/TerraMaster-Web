import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../index.css";

export default function Dashboard() {
  const [userCounts, setUserCounts] = useState({
    Landowner: 0,
    Surveyor: 0,
    Processor: 0,
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "users"));
        const userList = snapshot.docs
          .map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id,
              profile:
                userData.profile_picture || "https://via.placeholder.com/50",
              fullName: `${userData.first_name || "N/A"} ${
                userData.last_name || "N/A"
              }`,
              city: userData.City || "N/A",
              userType: userData.user_type || "N/A",
            };
          })
          .filter((user) =>
            ["Landowner", "Surveyor", "Processor"].includes(user.userType)
          );

        setUsers(userList);
        setFilteredUsers(userList);

        const counts = { Landowner: 0, Surveyor: 0, Processor: 0 };
        userList.forEach((user) => {
          if (user.userType === "Landowner") counts.Landowner++;
          if (user.userType === "Surveyor") counts.Surveyor++;
          if (user.userType === "Processor") counts.Processor++;
        });

        setUserCounts(counts);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalUsers =
    userCounts.Landowner + userCounts.Surveyor + userCounts.Processor;
  const getPercentage = (count) =>
    totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(2) : 0;

  const data = [
    {
      name: "Landowner",
      value: userCounts.Landowner,
      percentage: getPercentage(userCounts.Landowner),
      color: "#28a745",
    },
    {
      name: "Surveyor",
      value: userCounts.Surveyor,
      percentage: getPercentage(userCounts.Surveyor),
      color: "#6f42c1",
    },
    {
      name: "Processor",
      value: userCounts.Processor,
      percentage: getPercentage(userCounts.Processor),
      color: "#dc3545",
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.city.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.userType.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="w-full max-w-7xl pt-10 m-auto">
      <h2 className="text-4xl font-bold text-gray-800">User Statistics</h2>
      <p className="text-md text-gray-600 mb-6">{currentDate}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Users</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, city, or type"
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse bg-gray-50 rounded-lg shadow-md text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-3 text-left">Profile</th>
                    <th className="p-3 text-left">Full Name</th>
                    <th className="p-3 text-center">City</th>
                    <th className="p-3 text-center">User Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.slice(0, 6).map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-100 transition-all"
                      >
                        <td className="p-3">
                          <img
                            src={user.profile}
                            alt="User Profile"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
                          />
                        </td>
                        <td className="p-3">{user.fullName}</td>
                        <td className="p-3 text-center">{user.city}</td>
                        <td className="p-3 text-center font-semibold text-blue-600">
                          {user.userType}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-3 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">
            Users Distribution
          </h3>

          {loading ? (
            // Loading Animation
            <div className="flex justify-center items-center h-[300px]">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ percentage }) => `${percentage}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center text-sm bg-gray-100 p-3 rounded-lg shadow"
              >
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-600 font-bold">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
