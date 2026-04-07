/**
 * Admin API functions
 * All requests include JWT Authorization header and require admin group membership
 */
import { apiRequest } from "./api";

// ============ ADMIN: APPOINTMENTS ============

/** GET /admin/appointments - List all appointments */
export function adminGetAppointments() {
  return apiRequest("/admin/appointments", { method: "GET" });
}

/** DELETE /admin/appointments/:id - Delete an appointment */
export function adminDeleteAppointment(appointmentId) {
  return apiRequest(`/admin/appointments/${appointmentId}`, { method: "DELETE" });
}

/** PUT /admin/appointments/:id - Update appointment status */
export function adminUpdateAppointment(appointmentId, data) {
  return apiRequest(`/admin/appointments/${appointmentId}`, { method: "PUT", body: data });
}

// ============ ADMIN: SERVICES ============

/** GET /admin/services - List all services */
export function adminGetServices() {
  return apiRequest("/admin/services", { method: "GET" });
}

/** POST /admin/services - Create a service */
export function adminCreateService(serviceData) {
  return apiRequest("/admin/services", { method: "POST", body: serviceData });
}

/** PUT /admin/services/:id - Update a service */
export function adminUpdateService(serviceId, serviceData) {
  return apiRequest(`/admin/services/${serviceId}`, { method: "PUT", body: serviceData });
}

/** DELETE /admin/services/:id - Delete a service */
export function adminDeleteService(serviceId) {
  return apiRequest(`/admin/services/${serviceId}`, { method: "DELETE" });
}

// ============ ADMIN: SPECIALISTS ============

/** GET /admin/specialists - List all specialists */
export function adminGetSpecialists() {
  return apiRequest("/admin/specialists", { method: "GET" });
}

/** POST /admin/specialists - Create a specialist */
export function adminCreateSpecialist(specialistData) {
  return apiRequest("/admin/specialists", { method: "POST", body: specialistData });
}

/** PUT /admin/specialists/:id - Update a specialist */
export function adminUpdateSpecialist(specialistId, specialistData) {
  return apiRequest(`/admin/specialists/${specialistId}`, { method: "PUT", body: specialistData });
}

/** DELETE /admin/specialists/:id - Delete a specialist */
export function adminDeleteSpecialist(specialistId) {
  return apiRequest(`/admin/specialists/${specialistId}`, { method: "DELETE" });
}

// ============ HELPER: Check Admin Role ============

/**
 * Decode JWT and check if user belongs to "admin" Cognito group
 */
export function isAdminUser() {
  try {
    const token = localStorage.getItem("idToken");
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const groups = payload["cognito:groups"] || [];
    return groups.includes("admin");
  } catch {
    return false;
  }
}
