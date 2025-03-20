import { useState, useEffect } from "react";
import { Lock, Key, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "../assets/images/Logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("savedCredentials"));
    
    if (savedCredentials) {
      const { email, password, timestamp } = savedCredentials;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      if (Date.now() - timestamp < oneWeek) {
        setEmail(email);
        setPassword(password);
        setRememberMe(true);
      } else {
        localStorage.removeItem("savedCredentials");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

          if (rememberMe) {
            const credentials = {
              email,
              password,
              timestamp: Date.now(),
            };
            localStorage.setItem("savedCredentials", JSON.stringify(credentials));
          } else {
            localStorage.removeItem("savedCredentials");
          }
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#F5EFE6]">
      <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center md:mb-1">
          <img src={logo} alt="TerraMaster Hub" className="w-60 md:w-60" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Welcome Back Admin
        </h2>
        <p className="text-sm md:text-md text-center text-gray-600 mb-4 md:mb-6">
          Login to access TerraMaster Hub
        </p>

        {/* Error Message */}
        <div className="h-12 flex items-center justify-center mb-4">
          {error && (
            <p className="text-red-600 text-center bg-red-100 border border-red-400 px-4 py-2 rounded-md w-full">
              {error}
            </p>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full">
          {/* Email */}
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

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-yellow-900 focus:border-yellow-900"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="cursor-pointer w-4 h-4 text-yellow-900 border-gray-300 rounded focus:ring-yellow-900"
            />
            <label htmlFor="rememberMe" className="text-gray-700 text-sm cursor-pointer">
              Remember Me
            </label>
          </div>

          {/* Login Button with Loading Animation */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-yellow-900 text-white py-3 rounded-md font-medium hover:bg-yellow-800 transition disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Key size={18} />
            )}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
