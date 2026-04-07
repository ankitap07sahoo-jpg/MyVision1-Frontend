import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { apiVerifyOtp } from "../api/auth";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email is passed via navigate state from Signup page
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    setResending(true);
    setError("");

    try {
      // TODO: Implement resend confirmation code endpoint in backend
      // await resendConfirmationCode({ email: formData.email.trim() });
      setSuccess("Resend functionality coming soon. Please check your email for the existing code.");
    } catch (err) {
      if (err.code === "LimitExceededException") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to resend code.");
      }
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.otp) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Confirm signup via backend API
      const response = await apiVerifyOtp({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
      });

      if (response.message) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1800);
      }
    } catch (err) {
      // Handle specific Cognito errors
      if (err.code === "CodeMismatchException") {
        setError("Invalid verification code. Please try again.");
      } else if (err.code === "ExpiredCodeException") {
        setError("Verification code has expired. Please request a new one.");
      } else if (err.code === "NotAuthorizedException") {
        setError("User is already confirmed. Please login.");
      } else if (err.code === "LimitExceededException") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Verify Your Email</h1>
          <p>Enter the 6-digit OTP sent to your email address</p>
        </div>
      </section>

      <section className="login-section">
        <div className="container">
          <div className="login-card">
            <h2>Email Verification</h2>
            <p className="login-subtitle">Check your inbox for the OTP</p>

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

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="auth-switch">
              Didn't receive an OTP?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={handleResendCode}
                disabled={resending}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {resending ? "Sending..." : "Resend Code"}
              </button>
              {" | "}
              <Link to="/signup" className="auth-switch-link">
                Back to Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerifyOtp;
