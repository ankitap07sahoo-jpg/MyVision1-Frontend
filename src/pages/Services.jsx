import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicServices } from "../api/publicApi";

import servicesHeroBg from "../assets/images/services/services-hero-bg.png";
import servicesBg from "../assets/images/services/services-bg.png";
import eyeExamImage from "../assets/images/services/eye-examination.png";
import laserSurgeryImage from "../assets/images/services/laser-surgery.png";
import contactLensesImage from "../assets/images/services/contact-lenses.png";
import cataractImage from "../assets/images/services/cataract-treatment.png";

const fallbackImages = [
  eyeExamImage,
  laserSurgeryImage,
  contactLensesImage,
  cataractImage,
];

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPublicServices();
        if (!active) return;
        setServices(data.services || []);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load services.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  const handleBookAppointment = (serviceId) => {
    // ProtectedRoute on /appointment/:serviceId handles auth check
    // and preserves redirect state — just navigate directly
    navigate(`/appointment/${serviceId}`);
  };

  return (
    <div className="page-wrapper">
      <section
        className="page-hero services-page-hero"
        style={{ backgroundImage: `url(${servicesHeroBg})` }}
      >
        <div className="container">
          <h1>Our Services</h1>
          <p>
            Explore our comprehensive range of eye care services designed with
            your well-being in mind.
          </p>
        </div>
      </section>

      <section 
        className="services-page-section"
        style={{ 
          backgroundImage: `url(${servicesBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container">
          {loading ? (
            <p className="empty-msg">Loading services...</p>
          ) : error ? (
            <div className="admin-error">
              {error} <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : services.length === 0 ? (
            <p className="empty-msg">No services available right now.</p>
          ) : (
            <div className="services-page-grid">
              {services.map((service, index) => (
                <div
                  className="service-page-card"
                  key={service.serviceId}
                  onClick={() => navigate(`/services/${service.serviceId}`)}
                >
                  <div className="service-page-card-image">
                    <img src={fallbackImages[index % fallbackImages.length]} alt={service.name} />
                  </div>
                  <div className="service-page-card-content">
                    <h3>{service.name}</h3>
                    <p>{service.description || ""}</p>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAppointment(service.serviceId);
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Services;
