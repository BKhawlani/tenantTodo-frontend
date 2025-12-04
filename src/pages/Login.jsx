import { useState,useEffect } from "react";
import api from "../services/api";
import './Login.css';
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
if (rememberMe) {
  localStorage.setItem("savedEmail", email);
} else {
  localStorage.removeItem("savedEmail");
}

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("avatar", res.data.user.avatar || "/avatar.png");


      // Redirect to dashboard after login
    if (res.data.isAdmin) {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }

    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
useEffect(() => {
  const savedEmail = localStorage.getItem("savedEmail");

  if (savedEmail) {
    setEmail(savedEmail);
    setRememberMe(true);
  }
}, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
<div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
 

         <div className="form-options">
<label className="checkbox-container">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={() => setRememberMe(!rememberMe)}
  />
  <span className="checkmark"></span>
  Remember me
</label>


  
</div>


          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up now</a>
          </p>
        </div>

      
      </div>
    </div>
  );
}

export default Login;