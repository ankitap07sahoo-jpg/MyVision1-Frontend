import { useNavigate } from "react-router-dom";

import servicesHeroBg from "../assets/images/services/services-hero-bg.png";
import servicesBg from "../assets/images/services/services-bg.png";
import eyeExamImage from "../assets/images/services/eye-examination.png";
import laserSurgeryImage from "../assets/images/services/laser-surgery.png";
import contactLensesImage from "../assets/images/services/contact-lenses.png";
import cataractImage from "../assets/images/services/cataract-treatment.png";

const services = [
  {
    id: 1,
    name: "Eye Examination",
    image: eyeExamImage,
    description:
      "Comprehensive eye exams using state-of-the-art diagnostic equipment to evaluate your vision and overall eye health. Early detection of conditions like glaucoma, cataracts, and macular degeneration.",
  },
  {
    id: 2,
    name: "Laser Surgery",
    image: laserSurgeryImage,
    description:
      "Advanced LASIK and blade-free laser vision correction to reduce or eliminate your dependence on glasses and contact lenses. Safe, quick, and highly effective.",
  },
  {
    id: 3,
    name: "Contact Lenses",
    image: contactLensesImage,
    description:
      "Expert fitting and prescription of contact lenses tailored to your lifestyle. We offer daily, monthly, toric, multifocal, and specialty lenses for all needs.",
  },
  {
    id: 4,
    name: "Cataract Treatment",
    image: cataractImage,
    description:
      "Modern phacoemulsification cataract surgery with premium intraocular lens implants. Restore crystal-clear vision with a quick, painless outpatient procedure.",
  },
];

function Services() {
  const navigate = useNavigate();

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
          <div className="services-page-grid">
            {services.map((service) => (
              <div
                className="service-page-card"
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
              >
                <div className="service-page-card-image">
                  <img src={service.image} alt={service.name} />
                </div>
                <div className="service-page-card-content">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookAppointment(service.id);
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
