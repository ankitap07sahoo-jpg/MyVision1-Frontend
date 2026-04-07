import { useParams, useNavigate } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "Eye Examination",
    description:
      "Comprehensive eye exams using state-of-the-art diagnostic equipment to evaluate your vision and overall eye health. Early detection of conditions like glaucoma, cataracts, and macular degeneration.",
    duration: "45 minutes",
    price: "₹500",
    details:
      "Our comprehensive eye examination includes visual acuity testing, refraction assessment, eye pressure measurement (tonometry), slit-lamp examination, dilated fundus examination, and retinal imaging. We use the latest OCT technology for detailed retinal scans.",
  },
  {
    id: 2,
    name: "Laser Surgery",
    description:
      "Advanced LASIK and blade-free laser vision correction to reduce or eliminate your dependence on glasses and contact lenses. Safe, quick, and highly effective.",
    duration: "30 minutes per eye",
    price: "₹45,000",
    details:
      "Our LASIK procedure uses femtosecond laser technology for bladeless, precise corneal flap creation. The excimer laser then reshapes the cornea to correct your refractive error. Pre-operative evaluation, surgery, and all post-operative visits are included.",
  },
  {
    id: 3,
    name: "Contact Lenses",
    description:
      "Expert fitting and prescription of contact lenses tailored to your lifestyle. We offer daily, monthly, toric, multifocal, and specialty lenses for all needs.",
    duration: "30 minutes",
    price: "₹800",
    details:
      "Our contact lens service includes a thorough eye examination, corneal topography for precise fitting, trial lens evaluation, and training on insertion, removal, and care. Follow-up visits ensure optimal comfort and vision.",
  },
  {
    id: 4,
    name: "Cataract Treatment",
    description:
      "Modern phacoemulsification cataract surgery with premium intraocular lens implants. Restore crystal-clear vision with a quick, painless outpatient procedure.",
    duration: "20 minutes per eye",
    price: "₹35,000",
    details:
      "Our cataract surgery uses micro-incision phacoemulsification with foldable IOL implantation. We offer monofocal, multifocal, and toric IOL options. Pre-operative assessment, surgery under topical anesthesia, and post-operative care are all included.",
  },
];

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = services.find((s) => s.id === parseInt(id));

  if (!service) {
    return (
      <div className="page-wrapper">
        <section className="page-hero">
          <div className="container">
            <h1>Service Not Found</h1>
            <p>The requested service does not exist.</p>
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
                <span>{service.duration}</span>
              </div>
              <div className="meta-item">
                <strong>💰 Starting From</strong>
                <span>{service.price}</span>
              </div>
            </div>

            <div className="service-details-body">
              <h2>What to Expect</h2>
              <p>{service.details}</p>
            </div>

            <div className="service-details-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/appointment/${service.id}`)}
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
