// import api from "../../api/axios";
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Logout() {
//   const navigate = useNavigate();
//   async function handleLogout() {
//     try {
//       await api.post("/auth/logout");

//       navigate("/", {
//         state: {
//           message: "Logged out successfully",
//         },
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
//         {/* Logout Icon */}
//         <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
//           <span className="text-3xl">👋</span>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-800">Log out?</h1>

//         <p className="mt-3 text-gray-600">Are you sure you want to log out?</p>

//         <div className="mt-8 space-y-3">
//           <button
//             className="block w-full rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
//             type="button"
//             onClick={handleLogout}
//           >
//             Log out
//           </button>

//           <Link
//             to={"/dashboard"}
//             className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
//           >
//             Go to Dashboard
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Logout;

import api from "../../api/axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/", {
        state: {
          message: "Logged out successfully",
        },
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">👋</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">Log out?</h1>

        <p className="mt-3 text-gray-600">Are you sure you want to log out?</p>

        <div className="mt-8 space-y-3">
          <button
            className="block w-full rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>

          <Link
            to={"/dashboard"}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Logout;
