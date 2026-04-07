import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  adminGetAppointments,
  adminDeleteAppointment,
  adminUpdateAppointment,
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminGetSpecialists,
  adminCreateSpecialist,
  adminUpdateSpecialist,
  adminDeleteSpecialist,
} from "../../api/adminApi";
import "./AdminDashboard.css";

/* ─── tiny helper ─── */
const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString() : "—");

/* ========================================================= */
/*  MAIN COMPONENT                                           */
/* ========================================================= */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("appointments");

  return (
    <div className="admin-layout">
      {/* ─── SIDEBAR ─── */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>My<span>Vision</span></h2>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-nav">
          <button className={tab === "appointments" ? "active" : ""} onClick={() => setTab("appointments")}>
            <span className="nav-icon">📅</span> Appointments
          </button>
          <button className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}>
            <span className="nav-icon">🩺</span> Services
          </button>
          <button className={tab === "specialists" ? "active" : ""} onClick={() => setTab("specialists")}>
            <span className="nav-icon">👨‍⚕️</span> Specialists
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-email">{user?.email}</p>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {tab === "appointments" && "Manage Appointments"}
            {tab === "services" && "Manage Services"}
            {tab === "specialists" && "Manage Specialists"}
          </h1>
        </header>

        <div className="admin-content">
          {tab === "appointments" && <AppointmentsPanel />}
          {tab === "services" && <ServicesPanel />}
          {tab === "specialists" && <SpecialistsPanel />}
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/*  APPOINTMENTS PANEL                                       */
/* ========================================================= */
function AppointmentsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetAppointments();
      setRows(data.appointments || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await adminDeleteAppointment(id);
      setRows((r) => r.filter((a) => a.appointmentId !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await adminUpdateAppointment(id, { status: "cancelled" });
      setRows((r) => r.map((a) => (a.appointmentId === id ? { ...a, status: "cancelled" } : a)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading appointments...</div>;
  if (error) return <div className="admin-error">{error} <button onClick={load}>Retry</button></div>;

  return (
    <>
      <div className="admin-toolbar">
        <span className="badge">{rows.length} appointment{rows.length !== 1 ? "s" : ""}</span>
        <button className="btn btn-sm btn-outline" onClick={load}>Refresh</button>
      </div>

      {rows.length === 0 ? (
        <p className="empty-msg">No appointments found.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.appointmentId}>
                  <td>{a.fullName}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.service}</td>
                  <td>{a.appointmentDate || "—"}</td>
                  <td>{a.appointmentTime || "—"}</td>
                  <td>
                    <span className={`status-badge status-${(a.status || "pending").toLowerCase()}`}>
                      {a.status || "pending"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {a.status !== "cancelled" && (
                      <button className="btn-action btn-cancel" onClick={() => handleCancel(a.appointmentId)}>Cancel</button>
                    )}
                    <button className="btn-action btn-delete" onClick={() => handleDelete(a.appointmentId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ========================================================= */
/*  SERVICES PANEL                                           */
/* ========================================================= */
function ServicesPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetServices();
      setRows(data.services || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", duration: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const data = await adminUpdateService(editing, form);
        setRows((r) => r.map((s) => (s.serviceId === editing ? data.service : s)));
      } else {
        const data = await adminCreateService(form);
        setRows((r) => [...r, data.service]);
      }
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (svc) => {
    setForm({ name: svc.name, description: svc.description || "", price: svc.price || "", duration: svc.duration || "" });
    setEditing(svc.serviceId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await adminDeleteService(id);
      setRows((r) => r.filter((s) => s.serviceId !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading services...</div>;
  if (error) return <div className="admin-error">{error} <button onClick={load}>Retry</button></div>;

  return (
    <>
      <div className="admin-toolbar">
        <span className="badge">{rows.length} service{rows.length !== 1 ? "s" : ""}</span>
        <button className="btn btn-sm btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Service</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editing ? "Edit Service" : "New Service"}</h3>
          <div className="form-grid">
            <input placeholder="Service name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Price (e.g. $199)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input placeholder="Duration (e.g. 30 min)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="form-actions">
            <button type="submit" className="btn btn-sm btn-primary">{editing ? "Update" : "Create"}</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {rows.length === 0 && !showForm ? (
        <p className="empty-msg">No services yet. Click "Add Service" to create one.</p>
      ) : (
        <div className="cards-grid">
          {rows.map((s) => (
            <div className="admin-card" key={s.serviceId}>
              <h4>{s.name}</h4>
              {s.description && <p className="card-desc">{s.description}</p>}
              <div className="card-meta">
                {s.price && <span>💰 {s.price}</span>}
                {s.duration && <span>⏱ {s.duration}</span>}
              </div>
              <div className="card-actions">
                <button className="btn-action btn-edit" onClick={() => startEdit(s)}>Edit</button>
                <button className="btn-action btn-delete" onClick={() => handleDelete(s.serviceId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ========================================================= */
/*  SPECIALISTS PANEL                                        */
/* ========================================================= */
function SpecialistsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", specialization: "", experience: "", description: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminGetSpecialists();
      setRows(data.specialists || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ name: "", specialization: "", experience: "", description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const data = await adminUpdateSpecialist(editing, form);
        setRows((r) => r.map((sp) => (sp.specialistId === editing ? data.specialist : sp)));
      } else {
        const data = await adminCreateSpecialist(form);
        setRows((r) => [...r, data.specialist]);
      }
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (sp) => {
    setForm({ name: sp.name, specialization: sp.specialization || "", experience: sp.experience || "", description: sp.description || "" });
    setEditing(sp.specialistId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this specialist?")) return;
    try {
      await adminDeleteSpecialist(id);
      setRows((r) => r.filter((sp) => sp.specialistId !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading specialists...</div>;
  if (error) return <div className="admin-error">{error} <button onClick={load}>Retry</button></div>;

  return (
    <>
      <div className="admin-toolbar">
        <span className="badge">{rows.length} specialist{rows.length !== 1 ? "s" : ""}</span>
        <button className="btn btn-sm btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Specialist</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editing ? "Edit Specialist" : "New Specialist"}</h3>
          <div className="form-grid">
            <input placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Specialization *" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
            <input placeholder="Experience (e.g. 10 years)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </div>
          <textarea placeholder="Description / Bio" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="form-actions">
            <button type="submit" className="btn btn-sm btn-primary">{editing ? "Update" : "Create"}</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {rows.length === 0 && !showForm ? (
        <p className="empty-msg">No specialists yet. Click "Add Specialist" to create one.</p>
      ) : (
        <div className="cards-grid">
          {rows.map((sp) => (
            <div className="admin-card" key={sp.specialistId}>
              <h4>{sp.name}</h4>
              <p className="card-role">{sp.specialization}</p>
              {sp.description && <p className="card-desc">{sp.description}</p>}
              {sp.experience && <p className="card-meta"><span>🏥 {sp.experience}</span></p>}
              <div className="card-actions">
                <button className="btn-action btn-edit" onClick={() => startEdit(sp)}>Edit</button>
                <button className="btn-action btn-delete" onClick={() => handleDelete(sp.specialistId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
