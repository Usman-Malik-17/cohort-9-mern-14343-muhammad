// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { getUsers } from "../../helpers/users";
// import { setCurrentUser } from "../../helpers/profile";

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   function handleSubmit() {
//     const normalizedEmail = email.trim().toLowerCase();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(normalizedEmail)) {
//       alert("Please enter a valid email address.");
//       return;
//     }
//     const users = getUsers();
//     const existingUser = users.find((user) => user.email === normalizedEmail);
//     if (!existingUser || existingUser.password !== password) {
//       alert("These credentials do not match our records");
//       return;
//     }

//     setCurrentUser(existingUser);
//     localStorage.setItem("isLoggedIn", "true");
//     navigate("/dashboard");
//   }
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full sm:max-w-[420px] px-5 bg-white rounded-lg shadow-lg p-10">
//         <div>
//           <h2 className="font-sans text-center text-2xl font-bold text-gray-900">
//             Sign in to your account
//           </h2>
//           <div className="mt-2 text-center text-sm">
//             <span className="text-gray-500">Don't have an account? </span>
//             <Link
//               to="/signup"
//               className="underline text-gray-900 font-medium hover:text-blue-600 transition-colors duration-150"
//             >
//               Sign up
//             </Link>
//           </div>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form
//             className="space-y-6"
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//           >
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-900"
//               >
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   autoComplete="email"
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-900"
//                 >
//                   Password
//                 </label>
//               </div>
//               <div className="mt-2">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   autoComplete="current-password"
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");

  async function handleSubmit() {
    setMessage("");
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full sm:max-w-[420px] px-5 bg-white rounded-lg shadow-lg p-10">
        <div>
          <h2 className="font-sans text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <div className="mt-2 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              to="/signup"
              className="underline text-gray-900 font-medium hover:text-blue-600 transition-colors duration-150 cursor-pointer"
            >
              Sign up
            </Link>
          </div>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {message && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
