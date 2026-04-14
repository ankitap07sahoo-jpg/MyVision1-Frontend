/**
 * Public API functions (no auth required)
 */
import { publicRequest } from "./api";

/** GET /services - List all services */
export function getPublicServices() {
  return publicRequest("/services", { method: "GET" });
}

/** GET /services/:id - Get a single service */
export function getPublicService(serviceId) {
  return publicRequest(`/services/${serviceId}`, { method: "GET" });
}

/** GET /specialists - List all specialists */
export function getPublicSpecialists() {
  return publicRequest("/specialists", { method: "GET" });
}

/** GET /specialists/:id - Get a single specialist */
export function getPublicSpecialist(specialistId) {
  return publicRequest(`/specialists/${specialistId}`, { method: "GET" });
}
