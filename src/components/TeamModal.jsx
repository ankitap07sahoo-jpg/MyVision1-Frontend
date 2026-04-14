function TeamModal({ isOpen, onClose, doctor }) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content team-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="team-modal-body">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="team-modal-avatar-img"
            />
          ) : (
            <div className="team-modal-avatar">
              {doctor.name.charAt(0)}
            </div>
          )}
          <h2>{doctor.name}</h2>
          <p className="team-modal-role">{doctor.role}</p>
          <p className="team-modal-bio">{doctor.bio}</p>
          <div className="team-modal-details">
            <div className="detail-item">
              <strong>Specialization</strong>
              <span>{doctor.specialization}</span>
            </div>
            <div className="detail-item">
              <strong>Experience</strong>
              <span>{doctor.experience}</span>
            </div>
            <div className="detail-item">
              <strong>Qualification</strong>
              <span>{doctor.qualification}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamModal;