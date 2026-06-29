/** @format */

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setError } from "../auth.slice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setError(null));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin(formData);

    if (success) {
      navigate("/");
    }
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-[#18181B] rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <i className="ri-flashlight-fill text-violet-400"></i>
              NOVA AI
            </div>

            <h1 className="text-5xl font-bold mt-12 leading-tight">
              Welcome
              <br />
              <span className="text-violet-400">Back</span>
            </h1>

            <p className="mt-5 text-gray-300">Sign in to continue your journey.</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <i className="ri-shield-check-line text-3xl text-violet-400"></i>
              <div>
                <h3 className="font-semibold">Secure Login</h3>
                <p className="text-sm text-gray-400">
                  Your account is protected with modern security.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <i className="ri-lock-password-line text-3xl text-violet-400"></i>
              <div>
                <h3 className="font-semibold">Private Access</h3>
                <p className="text-sm text-gray-400">Access your dashboard safely and securely.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-[#111111] p-8 md:p-12 text-white flex items-center">
          <div className="w-full">
            <h2 className="text-4xl font-bold">Login</h2>

            <p className="text-gray-400 mt-2">Enter your credentials to access your account.</p>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    className="ml-3 w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                  type="button"
                  className="text-sm text-violet-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-violet-600 hover:bg-violet-700 transition font-semibold"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link to="/register">
                <span className="text-violet-400 cursor-pointer hover:underline">Register</span>
              </Link>
            </p>

            <p className="text-center text-gray-400 mt-2">
              {" "}
              Email not verified?{" "}
              <Link to="/verify-email" className="text-violet-400 hover:underline">
                {" "}
                Verify your email{" "}
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
