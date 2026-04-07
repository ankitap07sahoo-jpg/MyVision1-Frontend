import { useState } from "react";

function Contact() {
  // Auth is already verified by ProtectedRoute - no need to check here

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth is already verified by ProtectedRoute
    console.log("Contact Form Data:", formData);
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out today.</p>
        </div>
      </section>

      <section className="contact-page-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <div className="contact-item">
                <strong>📍 Address</strong>
                <p>Near Bando Pala, Kalahandi, Bhawanipatna</p>
              </div>
              <div className="contact-item">
                <strong>📞 Phone</strong>
                <p>+91 7205769288</p>
              </div>
              <div className="contact-item">
                <strong>✉️ Email</strong>
                <p>ankitap07sahoo@gmail.com</p>
              </div>
              <div className="contact-item">
                <strong>🕐 Working Hours</strong>
                <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
              </div>
            </div>

            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. We'll get back
                  to you soon at <strong>{formData.email}</strong>.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3>Send a Message</h3>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
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
                  <label htmlFor="email">Your Email</label>
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
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Appointment inquiry"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
