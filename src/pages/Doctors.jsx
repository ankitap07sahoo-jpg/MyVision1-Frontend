import { useEffect, useState } from "react";
import TeamModal from "../components/TeamModal";
import doctorsHeroBg from "../assets/images/doctors/doctors-hero-bg.png";
import doctorsSectionBg from "../assets/images/doctors/doctors-section-bg.png";
import doc1 from "../assets/images/doctors/doctor1.png";
import doc2 from "../assets/images/doctors/doctor2.png";
import doc3 from "../assets/images/doctors/doctor3.png";
import doc4 from "../assets/images/doctors/doctor4.png";
import { getPublicSpecialists } from "../api/publicApi";

const femaleImages = [doc1, doc3];
const maleImages = [doc2, doc4];
const fallbackImages = [doc1, doc2, doc3, doc4];
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

const pickDoctorImage = (name, index) => {
  const gender = detectGender(name);
  if (gender === "female") return femaleImages[index % femaleImages.length];
  if (gender === "male") return maleImages[index % maleImages.length];
  return fallbackImages[index % fallbackImages.length];
};

function Doctors() {
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPublicSpecialists();
        if (!active) return;
        setDoctors(data.specialists || []);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load specialists.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDoctors();
    return () => {
      active = false;
    };
  }, []);

  const openDoctorModal = (doctor, imageSrc) => {
    setSelectedDoctor(imageSrc ? { ...doctor, image: imageSrc } : doctor);
    setTeamModalOpen(true);
  };

  return (
    <div className="page-wrapper">
      <section
        className="page-hero doctors-page-hero"
        style={{ backgroundImage: `url(${doctorsHeroBg})` }}
      >
        <div className="container">
          <h1>Our Doctors</h1>
          <p>
            Meet our team of experienced and compassionate eye care
            professionals.
          </p>
        </div>
      </section>

      <section
        className="doctors-section doctors-section-bg"
        style={{ backgroundImage: `url(${doctorsSectionBg})` }}
      >
        <div className="container">
          {loading ? (
            <p className="empty-msg">Loading specialists...</p>
          ) : error ? (
            <div className="admin-error">
              {error} <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : doctors.length === 0 ? (
            <p className="empty-msg">No specialists available right now.</p>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doctor, index) => {
                const imageSrc = doctor.imageUrl || doctor.image || pickDoctorImage(doctor.name, index);

                return (
                  <div className="doctor-card" key={doctor.specialistId}>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={doctor.name}
                        className="doctor-image"
                      />
                    ) : (
                      <div className="doctor-image doctor-image--placeholder">
                        {doctor.name ? doctor.name.charAt(0) : "?"}
                      </div>
                    )}
                    <h3>{doctor.name}</h3>
                    <p className="doctor-specialization">
                      {doctor.specialization || "Specialist"}
                    </p>
                    <p className="doctor-experience">{doctor.experience || ""}</p>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openDoctorModal(doctor, imageSrc)}
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <TeamModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        doctor={selectedDoctor}
      />
    </div>
  );
}

export default Doctors;
