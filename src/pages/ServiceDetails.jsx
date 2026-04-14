import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicService } from "../api/publicApi";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadService = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPublicService(id);
        if (!active) return;
        setService(data.service || null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load service.");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) {
      loadService();
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
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

  if (error || !service) {
    return (
      <div className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <h1>Service Not Found</h1>
            <p>{error || "The requested service does not exist."}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/services")}
            >
              Back to Services
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
          <h1>{service.name}</h1>
          <p>{service.description}</p>
        </div>
      </section>

      <section className="service-details-section">
        <div className="container">
          <div className="service-details-card">
            <div className="service-details-meta">
              <div className="meta-item">
                <strong>⏱️ Duration</strong>
                <span>{service.duration || "—"}</span>
              </div>
              <div className="meta-item">
                <strong>💰 Starting From</strong>
                <span>{service.price || "—"}</span>
              </div>
            </div>

            <div className="service-details-body">
              <h2>What to Expect</h2>
              <p>{service.description || "We will share service details during your visit."}</p>
            </div>

            <div className="service-details-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/appointment/${service.serviceId}`)}
              >
                Book Appointment
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/services")}
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetails;
