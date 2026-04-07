import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * AuthProvider - Global authentication state manager
 * - Checks authentication status on app load using localStorage tokens
 * - Provides auth state and methods to entire application
 * - Ensures single source of truth for authentication
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if user is authenticated by checking localStorage
   * Called on app load and can be called manually to refresh state
   */
  const checkAuthState = useCallback(() => {
    try {
      const idToken = localStorage.getItem("idToken");
      const userEmail = localStorage.getItem("userEmail");
      
      if (idToken && userEmail) {
        setUser({ email: userEmail });
        setIsAuthenticated(true);
      } else {
        // No valid session
        localStorage.removeItem("idToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Error checking auth state
      console.log("Error checking auth state:", error.message);
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth state on initial app load
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  /**
   * Login handler - called after successful API login
   * Stores Cognito tokens and updates global auth state
   * @param {Object} authenticationResult - { AccessToken, IdToken, RefreshToken }
   * @param {string} email - User's email address
   */
  const login = useCallback((authenticationResult, email) => {
    try {
      if (authenticationResult.IdToken) {
        localStorage.setItem("idToken", authenticationResult.IdToken);
        localStorage.setItem("accessToken", authenticationResult.AccessToken);
        localStorage.setItem("refreshToken", authenticationResult.RefreshToken);
        localStorage.setItem("userEmail", email);
        setUser({ email });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login state update failed:", error);
      return false;
    }
  }, []);

  /**
   * Logout handler - clears tokens and auth state
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  /**
   * Get current IdToken for API calls
   */
  const getToken = useCallback(() => {
    try {
      const idToken = localStorage.getItem("idToken");
      return idToken || null;
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  }, []);

  // Expose getToken globally for API client fallback (after initialization)
  useEffect(() => {
    window.__authContext = { getToken };
  }, [getToken]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthState,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
