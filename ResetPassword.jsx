import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { apiResetPassword } from "../api/auth";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from ForgotPassword via navigate state
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, otp, newPassword, confirmPassword } = formData;

    if (!email || !otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Confirm password reset via backend API
      const response = await apiResetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (response.message) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch (err) {
      // Handle specific Cognito errors
      if (err.code === "CodeMismatchException") {
        setError("Invalid verification code. Please try again.");
      } else if (err.code === "ExpiredCodeException") {
        setError("Verification code has expired. Please request a new one.");
      } else if (err.code === "InvalidPasswordException") {
        setError("Password does not meet requirements. Use at least 6 characters.");
      } else if (err.code === "LimitExceededException") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Password reset failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Reset Password</h1>
          <p>Enter the OTP from your email and set a new password</p>
        </div>
      </section>

      <section className="login-section">
        <div className="container">
          <div className="login-card">
            <h2>Create New Password</h2>
            <p className="login-subtitle">
              Check your inbox for the reset OTP
            </p>

            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="otp">OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Min. 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <p className="auth-switch">
              Back to{" "}
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

export default ResetPassword;
