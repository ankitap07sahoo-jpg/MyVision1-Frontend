import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiForgotPassword } from "../api/auth";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Request password reset via backend API
      const response = await apiForgotPassword({ email: email.trim() });
      
      if (response.codeDeliveryDetails || response.message) {
        const destination = response.codeDeliveryDetails?.Destination || email.trim();
        setSuccess(`Verification code sent to ${destination}`);
        // Pass email to reset-password page via navigation state
        setTimeout(() => navigate("/reset-password", { state: { email: email.trim() } }), 1800);
      }
    } catch (err) {
      // Handle specific Cognito errors
      if (err.code === "UserNotFoundException") {
        setError("If this email exists, a reset code has been sent.");
      } else if (err.code === "LimitExceededException") {
        setError("Too many attempts. Please try again later.");
      } else if (err.code === "InvalidParameterException") {
        setError("Invalid email format.");
      } else {
        setError(err.message || "Failed to send reset code.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Forgot Password</h1>
          <p>We'll send a reset OTP to your registered email</p>
        </div>
      </section>

      <section className="login-section">
        <div className="container">
          <div className="login-card">
            <h2>Reset Your Password</h2>
            <p className="login-subtitle">
              Enter your account email to receive an OTP
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            <p className="auth-switch">
              Remembered your password?{" "}
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

export default ForgotPassword;
