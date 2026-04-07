/**
 * API utility for authenticated requests to AWS API Gateway
 * Uses Cognito JWT tokens stored in localStorage by AuthContext
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://4smy2qfmw3.execute-api.us-east-1.amazonaws.com/prod";

/**
 * Error class for API-specific errors
 */
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Get JWT token from localStorage (stored by AuthContext on login)
 */
function getAuthToken() {
  return localStorage.getItem("idToken") || null;
}

/**
 * Authenticated request to API Gateway
 * Automatically includes JWT token in Authorization header
 * Handles token refresh, 401 errors, and redirects to login if needed
 */
export async function apiRequest(endpoint, options = {}) {
  try {
    // Get token from localStorage
    const token = getAuthToken();

    if (!token) {
      throw new ApiError("Not authenticated. Please login.", 401, "NO_TOKEN");
    }

    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      },
    };

    // Add body for POST/PUT/PATCH requests
    if (options.body && ["POST", "PUT", "PATCH"].includes(config.method)) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new ApiError("Session expired. Please login again.", 401, "SESSION_EXPIRED");
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new ApiError("You don't have permission to access this resource.", 403, "FORBIDDEN");
    }

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
    }
    
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw error;
  }
}

/**
 * Unauthenticated request (for public endpoints)
 */
export async function publicRequest(endpoint, options = {}) {
  try {
    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (options.body && ["POST", "PUT", "PATCH"].includes(config.method)) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "Request failed",
        response.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
    }
    throw error;
  }
}

// ============ APPOINTMENT APIs (Protected) ============

/** GET /appointments - Get user's appointments */
export function getAppointments() {
  return apiRequest("/appointments", { method: "GET" });
}

/** POST /appointments - Create new appointment */
export function createAppointment(appointmentData) {
  return apiRequest("/appointments", { 
    method: "POST", 
    body: appointmentData 
  });
}

/** POST /appointments (public) - allow unauthenticated bookings */
export function publicCreateAppointment(appointmentData) {
  return publicRequest("/appointments", { method: "POST", body: appointmentData });
}

/** GET /appointments/:id - Get single appointment */
export function getAppointment(appointmentId) {
  return apiRequest(`/appointments/${appointmentId}`, { method: "GET" });
}

/** PUT /appointments/:id - Update appointment */
export function updateAppointment(appointmentId, appointmentData) {
  return apiRequest(`/appointments/${appointmentId}`, { 
    method: "PUT", 
    body: appointmentData 
  });
}

/** DELETE /appointments/:id - Cancel appointment */
export function cancelAppointment(appointmentId) {
  return apiRequest(`/appointments/${appointmentId}`, { method: "DELETE" });
}

// ============ USER PROFILE APIs (Protected) ============

/** GET /profile - Get user profile */
export function getUserProfile() {
  return apiRequest("/profile", { method: "GET" });
}

/** PUT /profile - Update user profile */
export function updateUserProfile(profileData) {
  return apiRequest("/profile", { 
    method: "PUT", 
    body: profileData 
  });
}

// ============ CONTACT APIs ============

/** POST /contact - Submit contact form */
export function submitContactForm(contactData) {
  return apiRequest("/contact", { 
    method: "POST", 
    body: contactData 
  });
}

// ============ HELPER FUNCTIONS ============

/**
 * Check if user is authenticated (has valid token in localStorage)
 */
export function isAuthenticated() {
  return !!localStorage.getItem("idToken");
}

/**
 * Get current token from localStorage
 */
export function getToken() {
  return localStorage.getItem("idToken");
}

/**
 * Clear authentication (logout)
 */
export function clearAuth() {
  localStorage.removeItem("idToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
}
