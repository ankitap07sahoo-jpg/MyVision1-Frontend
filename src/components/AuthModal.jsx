import { useState } from "react";
import { apiLogin, apiSignup, apiVerifyOtp } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmationCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    if (!formData.confirmationCode) {
      setError("Please enter the confirmation code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiVerifyOtp({
        email: pendingEmail,
        otp: formData.confirmationCode,
      });

      // Auto-login after confirmation
      const response = await apiLogin({
        email: pendingEmail,
        password: formData.password,
      });

      if (response.authenticationResult) {
        login(response.authenticationResult, pendingEmail);
        const user = { name: formData.name || "Patient", email: pendingEmail };
        onLoginSuccess(user);
        setFormData({ name: "", email: "", password: "", confirmationCode: "" });
        setNeedsConfirmation(false);
        setPendingEmail("");
        onClose();
      }
    } catch (err) {
      setError(err.message || "Confirmation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isLogin && !formData.name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login via backend API
        const response = await apiLogin({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (response.authenticationResult) {
          login(response.authenticationResult, formData.email.trim());
          const user = { name: "Patient", email: formData.email };
          onLoginSuccess(user);
          setFormData({ name: "", email: "", password: "", confirmationCode: "" });
          onClose();
        }
      } else {
        // Sign up via backend API
        await apiSignup({
          email: formData.email.trim(),
          username: formData.name.trim(),
          password: formData.password,
        });

        // Need email confirmation
        setPendingEmail(formData.email.trim());
        setNeedsConfirmation(true);
      }
    } catch (err) {
      if (err.code === "UserNotFoundException") {
        setError("No account found. Please sign up first.");
      } else if (err.code === "UserNotConfirmedException") {
        setPendingEmail(formData.email.trim());
        setNeedsConfirmation(true);
        setError("Please confirm your email first.");
      } else if (err.code === "NotAuthorizedException") {
        setError("Incorrect email or password.");
      } else if (err.code === "UsernameExistsException") {
        setError("An account with this email already exists.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setNeedsConfirmation(false);
    setPendingEmail("");
    setFormData({ name: "", email: "", password: "", confirmationCode: "" });
  };

  // Confirmation code form
  if (needsConfirmation) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <h2>Confirm Your Email</h2>
          <p className="modal-subtitle">
            We sent a confirmation code to {pendingEmail}
          </p>

          {error && <p className="modal-error">{error}</p>}

          <form onSubmit={handleConfirmSignUp}>
            <div className="form-group">
              <label htmlFor="confirmationCode">Confirmation Code</label>
              <input
                type="text"
                id="confirmationCode"
                name="confirmationCode"
                placeholder="Enter 6-digit code"
                value={formData.confirmationCode}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>

          <p className="modal-switch">
            <button className="link-btn" onClick={switchMode}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <p className="modal-subtitle">
          {isLogin
            ? "Welcome back to MyVision Eye Clinic"
            : "Create your MyVision account"}
        </p>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
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
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <p className="modal-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="link-btn" onClick={switchMode}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;