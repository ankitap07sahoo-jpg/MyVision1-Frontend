import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { apiLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the page user was trying to access, or default to home
  const from = location.state?.from?.pathname || "/";

  const heroBg = process.env.PUBLIC_URL + "/auth-hero-bg.png";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noAccount, setNoAccount] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setNoAccount(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setNoAccount(false);

    try {
      // Call backend API login endpoint
      const response = await apiLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.authenticationResult) {
        // Update global auth state with Cognito tokens
        login(response.authenticationResult, formData.email.trim());
        
        // Navigate to the page user was trying to access, or home
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err.code === "UserNotFoundException") {
        setNoAccount(true);
        setError("No account found. Please sign up first.");
      } else if (err.code === "UserNotConfirmedException") {
        setError("Please verify your email before logging in.");
      } else if (err.code === "NotAuthorizedException") {
        setError("Incorrect email or password.");
      } else {
        setError(err.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper login-page-wrapper">
      <section
        className="page-hero login-page-hero auth-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <h1>Login</h1>
          <p>Sign in to book appointments and access your dashboard</p>
        </div>
      </section>

      <section className="login-section">
        <div className="container">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">
              Enter your credentials to continue
            </p>

            {error && (
              <p className="login-error">
                {error}
                {noAccount && (
                  <>
                    {" "}—{" "}
                    <Link to="/signup" className="auth-switch-link">
                      Sign Up here
                    </Link>
                  </>
                )}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="forgot-password-link">
                <Link to="/forgot-password" className="auth-switch-link">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-switch-link">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;