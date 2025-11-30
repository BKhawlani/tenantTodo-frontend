import React, { useState } from "react";
import api from "../services/api";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });

      setSuccess(
        res.data.message ||
          "If this email exists in our system, you will receive a reset link."
      );
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a reset link</p>
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
          </div>
        )}

        <form onSubmit={handleForgot} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className={`login-button ${loading ? "loading" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-link">
            <a href="/">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
//dlji pswu mwxr nvtx
