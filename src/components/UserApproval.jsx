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

  if (loading) {
    return (
      <div className="w-full max-w-7xl pt-10 m-auto">
        <h2 className="text-4xl font-bold text-gray-900">
          View Land Surveyor's / Processor's Details
        </h2>
        <p className="text-md text-gray-600 mb-6">{currentDate}</p>
        <div className="bg-white p-5 rounded-lg shadow-md">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl pt-10 m-auto">
      <h2 className="text-4xl font-bold text-gray-900">
        View Land Surveyor's / Processor's Details
      </h2>
      <p className="text-md text-gray-600 mb-6">{currentDate}</p>

      <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-gray-50 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">Profile</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">User Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 transition-all"
              >
                <td className="p-3">
                  <img
                    src={user.profile_picture || "https://via.placeholder.com/50"}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border"
                  />
                </td>
                <td className="p-3">{user.first_name} {user.last_name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 font-semibold text-blue-600">{user.user_type}</td>
                <td className="p-3">{user.status}</td>
                <td className="p-3 flex justify-center gap-2">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing user details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
          {/* Modal Content */}
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <span className="text-2xl">&times;</span> {/* Close button */}
            </button>
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            {selectedUser && (
              <div>
                {/* Display Front and Back ID images at the top */}
                <div className="mt-4">
                  <h3 className="font-semibold">ID Images</h3>
                  <div className="flex gap-4 mt-2">
                    {/* Front ID */}
                    <div className="w-1/2 pr-2">
                      <p>
                        <strong>Front ID:</strong>
                      </p>
                      <img
                        src={selectedUser.frontIDUrl || "https://via.placeholder.com/150"}
                        alt="Front ID"
                        className="w-full rounded-md"
                      />
                    </div>
                    {/* Back ID */}
                    <div className="w-1/2 pl-2">
                      <p>
                        <strong>Back ID:</strong>
                      </p>
                      <img
                        src={selectedUser.backIDUrl || "https://via.placeholder.com/150"}
                        alt="Back ID"
                        className="w-full rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p>
                    <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>User Type:</strong> {selectedUser.user_type}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedUser.status}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
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
