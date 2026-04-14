import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicCreateAppointment } from "../api/api";
import { getPublicService } from "../api/publicApi";

// Using publicCreateAppointment for unauthenticated bookings

function Appointment() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Auth is already verified by ProtectedRoute - no need to check here
  const [service, setService] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailSent, setEmailSent] = useState(null);

  useEffect(() => {
    let active = true;

    const loadService = async () => {
      setServiceLoading(true);
      setServiceError("");
      try {
        const data = await getPublicService(serviceId);
        if (!active) return;
        setService(data.service || null);
      } catch (err) {
        if (!active) return;
        setServiceError(err.message || "Failed to load service.");
      } finally {
        if (active) setServiceLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }

    return () => {
      active = false;
    };
  }, [serviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call public API endpoint (no login required)
      const response = await publicCreateAppointment({
        serviceId: service?.serviceId,
        serviceName: service?.name,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
      });

      // Mark submitted and store email/message info
      setSubmitted(true);
      setEmailSent(!!response.emailSent);
      setSuccessMessage(
        response.message ||
          "Your appointment has been successfully booked. A confirmation email has been sent."
      );

      if (!response.emailSent) {
        setError(
          response.emailError
            ? `Appointment booked but email failed: ${response.emailError}`
            : "Appointment booked but confirmation email could not be sent. Please contact us for confirmation."
        );
      }
    } catch (err) {
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (serviceLoading) {
    return (
      <div className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <h1>Loading Service...</h1>
          </div>
        </section>
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <h1>Service Not Found</h1>
            <p>{serviceError || "The requested service does not exist."}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/services")}
            >
              Browse Services
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Book Appointment</h1>
          <p>
            You are booking an appointment for{" "}
            <strong>{service.name}</strong>
          </p>
        </div>
      </section>

      <section className="appointment-section">
        <div className="container">
          {submitted ? (
            <div className="appointment-success">
              <div className="success-icon">✅</div>
              <h2>{successMessage}</h2>
              <p>
                Thank you, <strong>{formData.name}</strong>! Your appointment for{" "}
                <strong>{service.name}</strong> has been confirmed.
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {emailSent ? (
                  <span>A confirmation email has been sent to <strong>{formData.email}</strong>.</span>
                ) : (
                  <span style={{ color: '#b71c1c' }}>
                    We could not send a confirmation email to <strong>{formData.email}</strong>.
                    Please contact support if needed.
                  </span>
                )}
              </p>
              <div className="appointment-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/services")}
                >
                  Browse Services
                </button>
              </div>
            </div>
          ) : (
            <div className="appointment-form-wrapper">
              <div className="appointment-info">
                <h3>Appointment Details</h3>
                <div className="info-item">
                  <strong>Service</strong>
                  <span>{service.name}</span>
                </div>
                <div className="info-item">
                  <strong>Clinic</strong>
                  <span>MyVision Eye Clinic</span>
                </div>
                <div className="info-item">
                  <strong>Location</strong>
                  <span>Near Bando Pala, Kalahandi, Bhawanipatna</span>
                </div>
              </div>

              <form className="appointment-form" onSubmit={handleSubmit}>
                <h3>Your Information</h3>
                
                {error && <p className="login-error">{error}</p>}
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 7205769288"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="appointmentDate">Preferred Date</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="appointmentTime">Preferred Time</label>
                  <input
                    type="time"
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Appointment"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Appointment;
