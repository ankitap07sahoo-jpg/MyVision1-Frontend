import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import TeamModal from "../components/TeamModal";
import heroBanner from "../assets/images/hero-banner.png";
import homeDoc1 from "../assets/images/doctors/home-doctor1.png";
import homeDoc2 from "../assets/images/doctors/home-doctor2.png";
import homeDoc3 from "../assets/images/doctors/home-doctor3.png";

const doctors = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    role: "Chief Ophthalmologist",
    specialization: "Cataract & Refractive Surgery",
    experience: "18+ Years",
    qualification: "MBBS, MS (Ophthalmology), FRCS",
    image: homeDoc1,
    bio: "Dr. Ananya Sharma is a renowned ophthalmologist specializing in advanced cataract and refractive surgeries. She has performed over 10,000 successful surgeries and is passionate about restoring vision to patients of all ages.",
  },
  {
    id: 2,
    name: "Dr. Rahul Mehta",
    role: "Retina Specialist",
    specialization: "Retinal Diseases & Vitreoretinal Surgery",
    experience: "14+ Years",
    qualification: "MBBS, DNB (Ophthalmology), Fellowship in Retina",
    image: homeDoc2,
    bio: "Dr. Rahul Mehta specializes in diagnosing and treating complex retinal conditions including diabetic retinopathy, macular degeneration, and retinal detachments.",
  },
  {
    id: 3,
    name: "Dr. Priya Kapoor",
    role: "Pediatric Eye Specialist",
    specialization: "Pediatric Ophthalmology & Strabismus",
    experience: "10+ Years",
    qualification: "MBBS, MS (Ophthalmology), Fellowship in Pediatric Eye Care",
    image: homeDoc3,
    bio: "Dr. Priya Kapoor is dedicated to children's eye health. She provides comprehensive eye care for children, from routine check-ups to complex surgeries for conditions like strabismus and amblyopia.",
  },
];

const services = [
  {
    icon: "👁️",
    title: "Comprehensive Eye Exams",
    description:
      "Thorough evaluation of your vision and eye health using state-of-the-art diagnostic equipment.",
  },
  {
    icon: "🔬",
    title: "Cataract Surgery",
    description:
      "Advanced phacoemulsification surgery with premium intraocular lens options for crystal-clear vision.",
  },
  {
    icon: "✨",
    title: "LASIK & Refractive Surgery",
    description:
      "Blade-free laser vision correction to reduce or eliminate dependence on glasses and contacts.",
  },
  {
    icon: "🩺",
    title: "Glaucoma Management",
    description:
      "Early detection and comprehensive management of glaucoma to preserve your precious eyesight.",
  },
  {
    icon: "👶",
    title: "Pediatric Eye Care",
    description:
      "Specialized eye care for children, including vision screening, lazy eye treatment, and more.",
  },
  {
    icon: "🔍",
    title: "Retina Services",
    description:
      "Expert diagnosis and treatment of retinal diseases including diabetic retinopathy and macular degeneration.",
  },
];

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleBookAppointment = () => {
    if (isAuthenticated) {
      // Already logged in - go directly to services
      navigate("/services");
    } else {
      // Not logged in - open auth modal
      setAuthOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    // Close modal and navigate to services after successful login
    setAuthOpen(false);
    navigate("/services");
  };

  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setTeamModalOpen(true);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="home" className="hero" style={{ backgroundImage: `url(${heroBanner})` }}>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>
                Your Vision, <span className="highlight">Our Mission</span>
              </h1>
              <p className="hero-subtitle">
                MyVision Eye Clinic delivers world-class eye care with
                compassion, precision, and the latest technology. See the world
                clearly — trust your eyes to our experts.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/services")}
                >
                  Our Services
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img src={heroBanner} alt="Advanced eye care technology at MyVision Clinic" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About MyVision</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                Founded with a commitment to excellence, MyVision Eye Clinic
                has been a trusted name in eye care for over a decade. Our
                team of experienced ophthalmologists and optometrists use
                cutting-edge technology to diagnose and treat a wide range of
                eye conditions.
              </p>
              <p>
                We believe that everyone deserves clear vision. From routine
                eye exams to complex surgical procedures, we provide
                personalized care tailored to each patient's unique needs.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <strong>10,000+</strong>
                  <span>Surgeries</span>
                </div>
                <div className="stat">
                  <strong>15+</strong>
                  <span>Years Experience</span>
                </div>
                <div className="stat">
                  <strong>25,000+</strong>
                  <span>Happy Patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive eye care solutions designed for your well-being
          </p>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/services")}
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <div className="container">
          <h2 className="section-title">Meet Our Doctors</h2>
          <p className="section-subtitle">
            Experienced professionals dedicated to your eye health
          </p>
          <div className="team-grid">
            {doctors.map((doctor) => (
              <div className="team-card" key={doctor.id}>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="team-avatar-img"
                />
                <h3>{doctor.name}</h3>
                <p className="team-role">{doctor.role}</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openDoctorModal(doctor)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/doctors")}
            >
              See All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <TeamModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        doctor={selectedDoctor}
      />
    </div>
  );
}

export default Home;