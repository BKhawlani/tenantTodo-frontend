import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../services/api";
import "./Login.css"; // ✔ نستخدم نفس الـ CSS

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Read token from URL
  const token = new URLSearchParams(window.location.search).get("token");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password,
      });

      setSuccess(res.data.message || "Your password has been reset!");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h2>Reset Password</h2>
          <p>Create a new password for your account</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon"></span>
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
            <br />
            <a
              href="/"
              style={{ color: "#4f46e5", fontWeight: "600", marginTop: "8px", display: "inline-block" }}
            >
              Go to Login →
            </a>
          </div>
        )}

        <form onSubmit={handleReset} className="login-form">
          
          {/* Password */}
          <div className="form-group">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                className="form-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat the password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <span
                className="toggle-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-link">
            Back to login <a href="/">Click here</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default PasswordReset;
