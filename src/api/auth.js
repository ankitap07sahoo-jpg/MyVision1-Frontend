// Central API utility for all auth-related and authenticated API calls
// Set REACT_APP_API_URL in your .env file to your backend URL

const BASE_URL = process.env.REACT_APP_API_URL || "https://4smy2qfmw3.execute-api.us-east-1.amazonaws.com/prod";

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
 * Generic fetch wrapper for unauthenticated requests
 * Throws an Error whose message comes from the backend JSON.
 */
async function request(endpoint, body, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "POST",
      headers: { 
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(
        data.message || "Something went wrong",
        res.status,
        data.code
      );
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
    }
    throw error;
  }
}

/**
 * Authenticated request wrapper
 * Automatically includes Cognito IdToken from localStorage
 * Handles 401 errors and network issues
 */
export async function authenticatedRequest(endpoint, body = null, options = {}) {
  try {
    // Get Cognito IdToken from AuthContext if available, fallback to localStorage
    let token = localStorage.getItem("idToken");
    if (!token && window.__authContext && window.__authContext.getToken) {
      token = window.__authContext.getToken();
    }
    if (!token) {
      throw new ApiError("Not authenticated. Please login.", 401, "NO_TOKEN");
    }
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    // Handle 401 Unauthorized - session expired
    if (res.status === 401) {
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new ApiError("Session expired. Please login again.", 401, "SESSION_EXPIRED");
    }
    // Handle 403 Forbidden - not authorized for this resource
    if (res.status === 403) {
      throw new ApiError("You don't have permission to access this resource.", 403, "FORBIDDEN");
    }
    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${res.status}`,
        res.status,
        data.code
      );
    }
    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.", 0, "NETWORK_ERROR");
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

/**
 * Helper to check if user is authenticated
 * For Cognito: checks if IdToken exists
 */
export function isAuthenticated() {
  return !!localStorage.getItem("idToken");
}

/**
 * Get current JWT token from localStorage
 * For Cognito: returns IdToken
 */
export function getToken() {
  return localStorage.getItem("idToken");
}

/** POST /auth/signup  → { userSub, username, codeDeliveryDetails } */
export function apiSignup({ email, username, password }) {
  return request("/auth/signup", { email, username, password });
}

/** POST /auth/confirm  → { message } */
export function apiVerifyOtp({ email, otp }) {
  return request("/auth/confirm", { email, code: otp });
}

/** POST /auth/login   → { authenticationResult: { AccessToken, IdToken, RefreshToken } } */
export function apiLogin({ email, password }) {
  return request("/auth/login", { email, password });
}

/** POST /auth/forgot-password  → { CodeDeliveryDetails } */
export function apiForgotPassword({ email }) {
  return request("/auth/forgot-password", { email });
}

/** POST /auth/reset-password  → { message } */
export function apiResetPassword({ email, otp, newPassword }) {
  return request("/auth/reset-password", { email, code: otp, newPassword });
}

// ============ AUTHENTICATED API CALLS ============

/** GET /appointments - Get user's appointments */
export function getAppointments() {
  return authenticatedRequest("/appointments", null, { method: "GET" });
}

/** POST /appointments - Create new appointment */
export function createAppointment(appointmentData) {
  return authenticatedRequest("/appointments", appointmentData);
}

/** DELETE /appointments/:id - Cancel appointment */
export function cancelAppointment(appointmentId) {
  return authenticatedRequest(`/appointments/${appointmentId}`, null, { method: "DELETE" });
}

/** GET /profile - Get user profile */
export function getUserProfile() {
  return authenticatedRequest("/profile", null, { method: "GET" });
}

/** PUT /profile - Update user profile */
export function updateUserProfile(profileData) {
  return authenticatedRequest("/profile", profileData, { method: "PUT" });
}
