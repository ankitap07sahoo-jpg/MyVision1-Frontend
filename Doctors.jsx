import { useState } from "react";
import TeamModal from "../components/TeamModal";
import doc1 from "../assets/images/doctors/doctor1.png";
import doc2 from "../assets/images/doctors/doctor2.png";
import doc3 from "../assets/images/doctors/doctor3.png";
import doc4 from "../assets/images/doctors/doctor4.png";
import doctorsHeroBg from "../assets/images/doctors/doctors-hero-bg.png";
import doctorsSectionBg from "../assets/images/doctors/doctors-section-bg.png";

const doctors = [
  {
    id: 1,
    name: "Dr. Anjali Sharma",
    role: "Chief Ophthalmologist",
    specialization: "Ophthalmologist",
    experience: "18+ Years",
    qualification: "MBBS, MS (Ophthalmology), FRCS",
    image: doc1,
    bio: "Dr. Anjali Sharma is a renowned ophthalmologist specializing in advanced cataract and refractive surgeries. She has performed over 10,000 successful surgeries and is passionate about restoring vision to patients of all ages.",
  },
  {
    id: 2,
    name: "Dr. Raj Mehta",
    role: "Cataract Specialist",
    specialization: "Cataract Specialist",
    experience: "14+ Years",
    qualification: "MBBS, DNB (Ophthalmology), Fellowship in Cataract Surgery",
    image: doc2,
    bio: "Dr. Raj Mehta specializes in diagnosing and treating complex cataract conditions with cutting-edge phacoemulsification techniques and premium intraocular lenses.",
  },
  {
    id: 3,
    name: "Dr. Priya Nair",
    role: "Laser Surgery Expert",
    specialization: "Laser Surgery Expert",
    experience: "10+ Years",
    qualification: "MBBS, MS (Ophthalmology), Fellowship in Laser Refractive Surgery",
    image: doc3,
    bio: "Dr. Priya Nair is dedicated to vision correction through advanced LASIK and PRK procedures. She provides comprehensive consultations and personalised treatment plans.",
  },
  {
    id: 4,
    name: "Dr. Amit Verma",
    role: "Retina Specialist",
    specialization: "Retina Specialist",
    experience: "12+ Years",
    qualification: "MBBS, MS (Ophthalmology), Fellowship in Retina",
    image: doc4,
    bio: "Dr. Amit Verma is an expert in retinal diseases including diabetic retinopathy, macular degeneration, and retinal detachments. He specialises in vitreoretinal microsurgery.",
  },
];

function Doctors() {
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
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
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="doctor-image"
                />
                <h3>{doctor.name}</h3>
                <p className="doctor-specialization">
                  {doctor.specialization}
                </p>
                <p className="doctor-experience">{doctor.experience}</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openDoctorModal(doctor)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
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
