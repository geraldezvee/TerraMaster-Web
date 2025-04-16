import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function TransactionRecords() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetchBookings();

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

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const snapshot = await getDocs(bookingsRef);
      const bookingsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
    setLoading(false);
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="font-mono min-h-screen bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-1">
        Transaction Records
      </h2>
      <p className="text-sm text-gray-500 mb-4">{currentDate}</p>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full border-collapse bg-gray-50 rounded-lg text-sm">
          <thead className="sticky top-0 bg-gray-200 text-gray-700 z-10">
            <tr>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Property Type</th>
              <th className="p-3 text-right">Contract Price</th>
              <th className="p-3 text-right">Down Payment</th>
              <th className="p-3 text-center">Stage</th>
              <th className="p-3 text-center">Start Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-100 transition-all"
                >
                  <td className="p-3">{booking.fullName}</td>
                  <td className="p-3">{booking.propertyType}</td>
                  <td className="p-3 text-right">{booking.contractPrice}.00</td>
                  <td className="p-3 text-right">{booking.downPayment}.00</td>
                  <td className="p-3 text-center">{booking.stage}</td>
                  <td className="p-3 text-center">
                    {formatDateTime(booking.startDateTime)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
