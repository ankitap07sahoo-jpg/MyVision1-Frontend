import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import TeamModal from "../components/TeamModal";
import heroBanner from "../assets/images/hero-banner.png";
import homeDoc1 from "../assets/images/doctors/home-doctor1.png";
import homeDoc2 from "../assets/images/doctors/home-doctor2.png";
import homeDoc3 from "../assets/images/doctors/home-doctor3.png";
import { getPublicServices, getPublicSpecialists } from "../api/publicApi";

const serviceIcons = ["👁️", "🔬", "✨", "🩺", "👶", "🔍", "🧿", "🩹"];
const femaleHomeImages = [homeDoc1, homeDoc3];
const maleHomeImages = [homeDoc2];
const homeDoctorImages = [homeDoc1, homeDoc2, homeDoc3];
const femaleNameTokens = ["anjali", "priya", "ananya", "neha", "sneha", "kavita", "pooja", "reena", "seema", "divya", "meera"];
const maleNameTokens = ["raj", "rahul", "amit", "rohit", "arjun", "vijay", "sachin", "vikram", "anil", "ravi", "deepak"];

const detectGender = (name) => {
  if (!name) return null;
  const lower = name.toLowerCase();
  if (lower.includes("mrs") || lower.includes("ms") || lower.includes("miss")) return "female";
  if (lower.includes("mr") || lower.includes("sir")) return "male";
  if (femaleNameTokens.some((token) => lower.includes(token))) return "female";
  if (maleNameTokens.some((token) => lower.includes(token))) return "male";
  return null;
};

const pickHomeDoctorImage = (name, index) => {
  const gender = detectGender(name);
  if (gender === "female") return femaleHomeImages[index % femaleHomeImages.length];
  if (gender === "male") return maleHomeImages[index % maleHomeImages.length];
  return homeDoctorImages[index % homeDoctorImages.length];
};

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [servicesError, setServicesError] = useState("");
  const [doctorsError, setDoctorsError] = useState("");

  useEffect(() => {
    let active = true;

    const loadHomeData = async () => {
      try {
        const [servicesResult, doctorsResult] = await Promise.all([
          getPublicServices(),
          getPublicSpecialists(),
        ]);

        if (!active) return;
        setServices(servicesResult.services || []);
        setDoctors(doctorsResult.specialists || []);
      } catch (err) {
        if (!active) return;
        setServicesError("Unable to load services right now.");
        setDoctorsError("Unable to load specialists right now.");
      }
    };

    loadHomeData();
    return () => {
      active = false;
    };
  }, []);

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

  const openDoctorModal = (doctor, imageSrc) => {
    setSelectedDoctor(imageSrc ? { ...doctor, image: imageSrc } : doctor);
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
            {servicesError ? (
              <p className="empty-msg">{servicesError}</p>
            ) : (
              services.slice(0, 6).map((service, index) => (
                <div className="service-card" key={service.serviceId || index}>
                  <div className="service-icon">{serviceIcons[index % serviceIcons.length]}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description || ""}</p>
                </div>
              ))
            )}
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
            {doctorsError ? (
              <p className="empty-msg">{doctorsError}</p>
            ) : (
              doctors.slice(0, 3).map((doctor, index) => {
                const imageSrc = doctor.imageUrl || doctor.image || pickHomeDoctorImage(doctor.name, index);

                return (
                  <div className="team-card" key={doctor.specialistId}>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={doctor.name}
                        className="team-avatar-img"
                      />
                    ) : (
                      <div className="team-avatar">
                        {doctor.name ? doctor.name.charAt(0) : "?"}
                      </div>
                    )}
                    <h3>{doctor.name}</h3>
                    <p className="team-role">{doctor.specialization || "Specialist"}</p>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openDoctorModal(doctor, imageSrc)}
                    >
                      View Profile
                    </button>
                  </div>
                );
              })
            )}
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