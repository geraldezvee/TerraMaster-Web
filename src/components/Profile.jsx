import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebaseConfig';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userId = user.uid;
          const userDocRef = doc(db, "users", userId);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl pt-10 m-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Admin Profile</h2>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl pt-10 m-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Admin Profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-8">
        {userData ? (
          <>
            <div className="flex items-center space-x-6">
              <img
                src={userData.profile_picture || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-indigo-600"
              />
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">{userData.first_name} {userData.last_name}</h1>
                <p className="text-gray-600">{userData.user_type}</p>
                <p className="text-gray-500">{userData.email}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600">Full Name</label>
                  <p className="text-gray-800">{userData.first_name} {userData.last_name}</p>
                </div>
                <div>
                  <label className="block text-gray-600">Email</label>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-600">User data not found.</div>
        )}
      </div>
    </div>
  );
}
