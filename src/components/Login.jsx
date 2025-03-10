import { useState, useEffect } from "react";
import { Lock, Key, Eye, EyeOff } from "lucide-react";
import logo from "../assets/images/Logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        
        if (userDoc.user_type === "Admin") {
          setIsAuthenticated(true);
          localStorage.setItem("savedEmail", email);
        } else {
          setError("You do not have the necessary permissions to log in.");
        }
      } else {
        setError("User not found.");
      }
    } catch (err) {
      const errorCode = err.code;
      let errorMessage = "An unexpected error occurred. Please try again.";

      switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          errorMessage = "Invalid credentials. Please check your email and password.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed login attempts. Try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your internet connection.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use. Try logging in.";
          break;
        default:
          errorMessage = "Login failed. Please check your details and try again.";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5EFE6] p-4">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-md w-full max-w-xl flex flex-col md:flex-row items-center min-h-[480px]">
        <div className="hidden md:block flex-shrink-0 mr-8">
          <img src={logo} alt="TerraMaster Hub" className="w-32 md:w-48" />
        </div>

        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-sm md:text-md text-center text-gray-600 mb-4 md:mb-6">
            Login to access TerraMaster Hub
          </p>

          <p className="text-red-600 text-center min-h-[24px] mb-4">{error}</p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-900 focus:border-yellow-900"
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-900 focus:border-yellow-900"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-yellow-900 text-white py-3 rounded-md font-medium hover:bg-yellow-800 transition"
            >
              <Key size={18} />
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
