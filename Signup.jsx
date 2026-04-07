import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiSignup } from "../api/auth";

function Signup() {
  const navigate = useNavigate();

  const heroBg = process.env.PUBLIC_URL + "/auth-hero-bg.png";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      setError("Username may only contain letters, numbers, underscores, hyphens, and dots.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call backend API signup endpoint
      const response = await apiSignup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.userSub || response.message) {
        // Navigate to OTP verification, passing username + email via state
        navigate("/verify-otp", {
          state: {
            email: formData.email.trim(),
            username: formData.username.trim(),
          },
        });
      }
    } catch (err) {
      // Handle specific Cognito errors
      if (err.code === "UsernameExistsException") {
        setError("An account with this email already exists.");
      } else if (err.code === "InvalidPasswordException") {
        setError("Password does not meet requirements. Use at least 6 characters.");
      } else if (err.code === "InvalidParameterException") {
        setError("Invalid email format.");
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <section
        className="page-hero auth-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <h1>Sign Up</h1>
          <p>Create your account to book appointments and more</p>
        </div>
      </section>

      <section className="login-section">
        <div className="container">
          <div className="login-card">
            <h2>Create Account</h2>
            <p className="login-subtitle">
              Fill in your details to get started
            </p>

            {error && <p className="login-error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
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
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="auth-switch-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
