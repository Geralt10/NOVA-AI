import { useDispatch } from "react-redux";
import {
  register,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  forgotPassword,
  getMe,
} from "../services/auth.api";
import { setUser, setLoading, setError, clearAuth } from "../auth.slice";

import toast from "react-hot-toast";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ username, email, password });
      toast.success(
        "Account created successfully, we have sent you an email please verify your email!"
      );
      return data.success;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "registration failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      toast.success("Login successful!");
      return data.success;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {

    try {
      dispatch(setLoading(true));

      const data = await getMe();
      

      dispatch(setUser(data.user));
    } catch (error) {
      console.log("getMe error:", error.response?.status, error.response?.data);

      dispatch(setError(error.response?.data?.message || "Failed to fetch data"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      const data = await logout();
      dispatch(clearAuth())
      toast.success("Logged out successfully!");
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResendVerificationEmail(email) {
    try {
      dispatch(setLoading(true));
      const data = await resendVerificationEmail({ email });
      toast.success("Verification email sent!");
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to resend verification email"));
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleForgotPassword(email) {
    try {
      dispatch(setLoading(true));
      await forgotPassword({ email });
      toast.success("Password reset link sent!");
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Forgot password failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResetPassword(token, password) {
    try {
      dispatch(setLoading(true));
      await resetPassword({ token, password });
      toast.success("Password reset successfully!");
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Password reset failed"));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetMe,
    handleResendVerificationEmail,
    handleResetPassword,
    handleForgotPassword,
  };
}
