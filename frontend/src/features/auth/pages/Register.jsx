import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setError } from "../auth.slice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleRegister } = useAuth();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setError(null));
    setValidationError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationError("");

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setValidationError("All fields are required.");
      return;
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;

    if (!usernameRegex.test(username)) {
      setValidationError(
        "Username must start with a letter and can only contain letters, numbers, and underscores."
      );
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      const success = await handleRegister({
        username,
        email,
        password,
      });
      if (success) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-[#18181B] rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
        {/* Left */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <i className="ri-flashlight-fill text-violet-400"></i>
              Perplexity
            </div>

            <h1 className="text-5xl font-bold mt-12 leading-tight">
              Create Your
              <br />
              <span className="text-violet-400">Account</span>
            </h1>

            <p className="mt-5 text-gray-300">
              Join our platform and start your amazing journey today.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <i className="ri-shield-check-line text-3xl text-violet-400"></i>
              <div>
                <h3 className="font-semibold">Secure</h3>
                <p className="text-gray-400 text-sm">Your data is encrypted and protected.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <i className="ri-flashlight-line text-3xl text-violet-400"></i>
              <div>
                <h3 className="font-semibold">Fast</h3>
                <p className="text-gray-400 text-sm">Smooth and lightning-fast experience.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <i className="ri-group-line text-3xl text-violet-400"></i>
              <div>
                <h3 className="font-semibold">Community</h3>
                <p className="text-gray-400 text-sm">Connect with thousands of users.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="bg-[#111111] p-8 md:p-12 text-white">
          <h2 className="text-4xl font-bold">Register</h2>

          <p className="text-gray-400 mt-2">Fill your details to create an account.</p>

          {(validationError || error) && (
            <div className="mt-5 bg-red-500/10 border border-red-500 text-red-400 rounded-xl p-3 text-sm">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <label className="text-sm mb-2 block">Username</label>

              <div className="flex items-center bg-[#1F1F23] border border-gray-700 rounded-xl px-4 h-14">
                <i className="ri-user-line text-gray-400"></i>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="ml-3 w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm mb-2 block">Email</label>

              <div className="flex items-center bg-[#1F1F23] border border-gray-700 rounded-xl px-4 h-14">
                <i className="ri-mail-line text-gray-400"></i>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="ml-3 w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm mb-2 block">Password</label>

              <div className="flex items-center bg-[#1F1F23] border border-gray-700 rounded-xl px-4 h-14">
                <i className="ri-lock-line text-gray-400"></i>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="ml-3 w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm mb-2 block">Confirm Password</label>

              <div className="flex items-center bg-[#1F1F23] border border-gray-700 rounded-xl px-4 h-14">
                <i className="ri-lock-password-line text-gray-400"></i>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="ml-3 w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-semibold transition ${
                loading
                  ? "bg-violet-500 opacity-60 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
