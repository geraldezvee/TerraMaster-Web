import React, { useState, useEffect } from "react";

const TransactionRecords = () => {
  const [currentDate, setCurrentDate] = useState("");

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

  return (
    <div className="min-h-screen bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Transaction Records
      </h2>
      <p className="text-gray-600 mb-6">{currentDate}</p>

      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          🚧 Still working on this page
        </h1>
        <p className="text-gray-600">
          The transaction records feature is coming soon. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default TransactionRecords;
