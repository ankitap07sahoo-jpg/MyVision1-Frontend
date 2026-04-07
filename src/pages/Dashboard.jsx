import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://4smy2qfmw3.execute-api.us-east-1.amazonaws.com/prod";

function Dashboard() {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Auth is already verified by ProtectedRoute - no need to check here

  /* ── Fetch appointments ── */
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/appointments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load appointments");
      setAppointments(data.appointments ?? data);
    } catch (err) {
      setError(err.message || "Could not fetch appointments.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || "Could not delete appointment.");
    }
  };

  /* ── Edit (inline) ── */
  const startEdit = (appt) => {
    setEditingId(appt.id);
    setEditForm({
      doctor: appt.doctor,
      date: appt.date,
      time: appt.time,
      type: appt.type,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...editForm } : a))
      );
      cancelEdit();
    } catch (err) {
      alert(err.message || "Could not update appointment.");
    }
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  /* ── Derived data for overview ── */
  const upcoming = appointments.filter((a) => a.status === "Upcoming");
  const completed = appointments.filter((a) => a.status === "Completed");
  const nextAppt = upcoming.length > 0 ? upcoming[0] : null;
  const lastVisit = completed.length > 0 ? completed[completed.length - 1] : null;

  /* ── Parse user from JWT payload (base-64) ── */
  let user = { name: "Patient", email: "" };
  try {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      user = { name: payload.name || "Patient", email: payload.email || "" };
    }
  } catch {
    /* token parse failed — keep defaults */
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container">
          <h1>Welcome, {user.name}!</h1>
          <p>Manage your appointments and eye health records</p>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </div>

          {/* ─── Overview Tab ─── */}
          {activeTab === "overview" && (
            <div className="tab-panel">
              {loading ? (
                <p>Loading dashboard…</p>
              ) : error ? (
                <p className="dashboard-error">{error}</p>
              ) : (
                <div className="overview-cards">
                  <div className="overview-card">
                    <div className="overview-icon">📅</div>
                    <div>
                      <h3>Next Appointment</h3>
                      {nextAppt ? (
                        <>
                          <p>
                            {nextAppt.date} — {nextAppt.time}
                          </p>
                          <span className="badge badge-upcoming">Upcoming</span>
                        </>
                      ) : (
                        <p>No upcoming appointments</p>
                      )}
                    </div>
                  </div>
                  <div className="overview-card">
                    <div className="overview-icon">👁️</div>
                    <div>
                      <h3>Last Visit</h3>
                      {lastVisit ? (
                        <>
                          <p>{lastVisit.date}</p>
                          <span className="badge badge-completed">Completed</span>
                        </>
                      ) : (
                        <p>No past visits</p>
                      )}
                    </div>
                  </div>
                  <div className="overview-card">
                    <div className="overview-icon">📋</div>
                    <div>
                      <h3>Total Visits</h3>
                      <p>
                        {appointments.length} appointment
                        {appointments.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Appointments Tab ─── */}
          {activeTab === "appointments" && (
            <div className="tab-panel">
              {loading ? (
                <p>Loading appointments…</p>
              ) : error ? (
                <p className="dashboard-error">
                  {error}{" "}
                  <button className="link-btn" onClick={fetchAppointments}>
                    Retry
                  </button>
                </p>
              ) : appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <div className="appointments-table-wrapper">
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) =>
                        editingId === appt.id ? (
                          <tr key={appt.id}>
                            <td>
                              <input
                                className="edit-input"
                                name="doctor"
                                value={editForm.doctor}
                                onChange={handleEditChange}
                              />
                            </td>
                            <td>
                              <input
                                className="edit-input"
                                name="date"
                                type="date"
                                value={editForm.date}
                                onChange={handleEditChange}
                              />
                            </td>
                            <td>
                              <input
                                className="edit-input"
                                name="time"
                                value={editForm.time}
                                onChange={handleEditChange}
                              />
                            </td>
                            <td>
                              <input
                                className="edit-input"
                                name="type"
                                value={editForm.type}
                                onChange={handleEditChange}
                              />
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  appt.status === "Upcoming"
                                    ? "badge-upcoming"
                                    : "badge-completed"
                                }`}
                              >
                                {appt.status}
                              </span>
                            </td>
                            <td className="action-btns">
                              <button
                                className="btn btn-sm btn-save"
                                onClick={() => saveEdit(appt.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-cancel"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr key={appt.id}>
                            <td>{appt.doctor}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>{appt.type}</td>
                            <td>
                              <span
                                className={`badge ${
                                  appt.status === "Upcoming"
                                    ? "badge-upcoming"
                                    : "badge-completed"
                                }`}
                              >
                                {appt.status}
                              </span>
                            </td>
                            <td className="action-btns">
                              <button
                                className="btn btn-sm btn-edit"
                                onClick={() => startEdit(appt)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-delete"
                                onClick={() => handleDelete(appt.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─── Profile Tab ─── */}
          {activeTab === "profile" && (
            <div className="tab-panel">
              <div className="profile-card">
                <div className="profile-avatar">{user.name.charAt(0)}</div>
                <div className="profile-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
