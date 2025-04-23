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
  const [visibleUsers, setVisibleUsers] = useState(6);

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
              status: userData.status || "Inactive",
            };
          })
          .filter(
            (user) =>
              user.status === "Active" &&
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
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.city.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setVisibleUsers(6);
  };

  const loadMoreUsers = () => {
    setVisibleUsers((prev) => prev + 6);
  };

  return (
    <div className="font-mono bg-yellow-200 min-h-screen p-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center sm:text-left">
        Dashboard
      </h2>
      <p className="text-xs sm:text-sm md:text-md text-gray-600 mb-3 md:mb-6 text-center sm:text-left">
        {currentDate}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 md:gap-6">
        {/* User List Section */}
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-4">
            Users
          </h3>
          <div className="mb-2 sm:mb-4">
            <input
              type="text"
              placeholder="Search by name, city, or type"
              value={searchQuery}
              onChange={handleSearch}
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-5 sm:py-10">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse bg-gray-50 rounded-lg shadow-md text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-2 sm:p-3 text-left">Profile</th>
                    <th className="p-2 sm:p-3 text-left">Full Name</th>
                    <th className="p-2 sm:p-3 text-center">City</th>
                    <th className="p-2 sm:p-3 text-center">User Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.slice(0, visibleUsers).map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-100 transition-all"
                      >
                        <td className="p-2 sm:p-3">
                          <img
                            src={user.profile}
                            alt="User Profile"
                            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border"
                          />
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap">
                          {user.fullName}
                        </td>
                        <td className="p-2 sm:p-3 text-center whitespace-nowrap">
                          {user.city}
                        </td>
                        <td className="p-2 sm:p-3 text-center font-semibold text-blue-600 whitespace-nowrap">
                          {user.userType}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center p-2 sm:p-3 text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {filteredUsers.length > visibleUsers && (
                <div className="mt-3 text-center">
                  <button
                    onClick={loadMoreUsers}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-4">
            Users Distribution
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-[250px] sm:h-[200px] md:h-[250px]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[200px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Legend */}
          <div className="mt-2 sm:mt-4 grid grid-cols-1 gap-2 sm:gap-4">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center text-xs sm:text-sm bg-gray-100 p-2 sm:p-3 rounded-lg shadow"
              >
                <div className="flex items-center">
                  <span
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3"
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

          {/* User Count Summary */}
          <div className="mt-3 bg-gray-50 p-2 sm:p-3 rounded-lg shadow-sm">
            <div className="text-center text-sm font-bold mb-1">
              Total Users: {totalUsers}
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs text-center">
              <div className="bg-green-100 p-1 rounded">
                <span className="block font-medium">Landowners</span>
                <span className="font-bold">{userCounts.Landowner}</span>
              </div>
              <div className="bg-purple-100 p-1 rounded">
                <span className="block font-medium">Surveyors</span>
                <span className="font-bold">{userCounts.Surveyor}</span>
              </div>
              <div className="bg-red-100 p-1 rounded">
                <span className="block font-medium">Processors</span>
                <span className="font-bold">{userCounts.Processor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
