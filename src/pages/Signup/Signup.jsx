import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";

function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+$/;

    if (!nameRegex.test(normalizedName)) {
      setError("Only alphabets are allowed in name");
      return;
    }
    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 12) {
      setError("Password must be at least 12 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        email: normalizedEmail,
        fullName: normalizedName,
        password,
      });
      navigate("/", {
        state: {
          message:
            "Account created! Please check your email to verify your account, then log in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full sm:max-w-[420px] px-5 bg-white rounded-xl shadow-lg p-8">
          <div>
            <h2 className="font-sans text-center text-2xl font-bold text-gray-900">
              Create account
            </h2>
            <div className="mt-2 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link
                to="/"
                className="underline text-gray-900 font-medium hover:text-blue-600 transition-colors duration-150"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Enter Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Enter email address
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
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Enter Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="new-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={passwordVisible === true ? "text" : "password"}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                  />
                  <button
                    className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                    type="button"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                  >
                    {passwordVisible === false ? (
                      <Eye className="absolute right-2 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    ) : (
                      <EyeOff className="absolute right-2 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirm-password"
                    name="confirm-Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={confirmPasswordVisible === true ? "text" : "password"}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                  />
                  <button
                    className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                    type="button"
                    onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                  >
                    {confirmPasswordVisible === false ? (
                      <Eye className="absolute right-2 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    ) : (
                      <EyeOff className="absolute right-2 top-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
