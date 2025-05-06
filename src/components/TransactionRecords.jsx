import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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

      // Create an array of promises for fetching user data
      const bookingsWithUserPromises = snapshot.docs.map(async (bookingDoc) => {
        const bookingData = bookingDoc.data();
        let hiredName = "N/A";

        // If bookedUserId exists, fetch the corresponding user
        if (bookingData.bookedUserId) {
          try {
            const userDocRef = doc(db, "users", bookingData.bookedUserId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Combine first and last name if available
              hiredName = `${userData.first_name || ""} ${
                userData.last_name || ""
              }`.trim();
              if (!hiredName) hiredName = "N/A"; // If both names are empty
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        return {
          id: bookingDoc.id,
          ...bookingData,
          hiredName: hiredName,
        };
      });

      // Wait for all promises to resolve
      const bookingsList = await Promise.all(bookingsWithUserPromises);
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

  // Calculate commission (3% of down payment)
  const calculateCommission = (downPayment) => {
    if (!downPayment) return "0.00";
    const commission = parseFloat(downPayment) * 0.03;
    return commission.toFixed(2);
  };

  // Card view for mobile devices
  const renderCardView = (booking) => (
    <div key={booking.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{booking.fullName}</h3>
        <span className="text-sm bg-yellow-100 px-2 py-1 rounded">
          {booking.stage}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-600">Booked:</div>
        <div>{booking.hiredName}</div>

        <div className="text-gray-600">Date & Time:</div>
        <div>{formatDateTime(booking.startDateTime)}</div>

        <div className="text-gray-600">Contract Price:</div>
        <div className="font-medium">{booking.contractPrice}.00</div>

        <div className="text-gray-600">Down Payment:</div>
        <div className="font-medium">{booking.downPayment}.00</div>

        <div className="text-gray-600">Commission:</div>
        <div className="font-medium text-green-600">
          {calculateCommission(booking.downPayment)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-mono min-h-screen bg-yellow-200 shadow-lg p-2 sm:p-6">
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 text-center sm:text-left">
        Transaction Records
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 text-center sm:text-left">
        {currentDate}
      </p>

      {/* Table view for larger screens */}
      <div className="hidden md:block bg-white p-4 rounded-lg shadow-md overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full border-collapse bg-gray-50 rounded-lg text-sm">
          <thead className="sticky top-0 bg-gray-200 text-gray-700 z-10">
            <tr>
              <th className="p-3 text-left">Property Owner</th>
              <th className="p-3 text-center">Start Date & Time</th>
              <th className="p-3 text-left">Booked</th>
              <th className="p-3 text-right">Contract Price</th>
              <th className="p-3 text-right">Down Payment</th>
              <th className="p-3 text-center">Stage</th>
              <th className="p-3 text-right">Commission</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
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
                  <td className="p-3 text-center">
                    {formatDateTime(booking.startDateTime)}
                  </td>
                  <td className="p-3">{booking.hiredName}</td>
                  <td className="p-3 text-right">{booking.contractPrice}.00</td>
                  <td className="p-3 text-right">{booking.downPayment}.00</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 bg-yellow-100 rounded-full text-xs">
                      {booking.stage}
                    </span>
                  </td>
                  <td className="p-3 text-right text-green-600">
                    {calculateCommission(booking.downPayment)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-800 rounded-full animate-spin"></div>
          </div>
        ) : bookings.length > 0 ? (
          bookings.map(renderCardView)
        ) : (
          <div className="text-center p-4 text-gray-500 bg-white rounded-lg">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
