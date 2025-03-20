import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserApproval() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("status", "==", "Pending"));
        const querySnapshot = await getDocs(q);

        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        setPendingUsers(usersList);
      } catch (error) {
        console.error("Error fetching pending users: ", error);
      }
      setLoading(false);
    };

    fetchPendingUsers();

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

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full max-w-7xl pt-10 m-auto">
      <h2 className="text-4xl font-bold text-gray-900">
        View Land Surveyor's / Processor's Details
      </h2>
      <p className="text-md text-gray-600 mb-6">{currentDate}</p>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Pending Users</h3>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full border-collapse bg-gray-50 rounded-lg shadow-md text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">User Type</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length > 0 ? (
                pendingUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <td className="p-3">
                      <img
                        src={user.profile_picture}
                        alt="User Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
                      />
                    </td>
                    <td className="p-3">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-3">{user.user_type}</td>
                    <td className="p-3 text-center">{user.status}</td>
                    <td className="p-3 flex flex-col sm:flex-row justify-center gap-1">
                      <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-all">
                        Approve
                      </button>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all"
                        onClick={() => openModal(user)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3 text-gray-500">
                    No pending users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-lg w-full max-w-lg shadow-xl relative">
            {/* Close button */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              User Details
            </h2>

            {/* ID Images Section */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <h3 className="font-semibold text-gray-700">Front ID</h3>
                <img
                  src={selectedUser.frontIDUrl}
                  alt="Front ID"
                  className="w-full h-100 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
              <div className="w-1/2">
                <h3 className="font-semibold text-gray-700">Back ID</h3>
                <img
                  src={selectedUser.backIDUrl}
                  alt="Back ID"
                  className="w-full h-100 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            </div>

            {/* User Info Section */}
            <div className="mt-4 text-gray-800">
              <p>
                <strong>Name:</strong> {selectedUser.first_name}{" "}
                {selectedUser.last_name}
              </p>
              <p>
                <strong>Email:</strong>
                <span className="text-blue-600 font-semibold">
                  {" "}
                  {selectedUser.email}
                </span>
              </p>
              <p>
                <strong>User Type:</strong> {selectedUser.user_type}
              </p>
              <p>
                <strong>Status:</strong>
                <span className="text-yellow-600 font-semibold">
                  {" "}
                  {selectedUser.status}
                </span>
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
