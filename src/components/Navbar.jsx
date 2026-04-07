import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAdminUser } from "../api/adminApi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const showAdmin = isAuthenticated && isAdminUser();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          My<span>Vision</span>
        </NavLink>

        <div
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" end onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" onClick={closeMenu}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctors" onClick={closeMenu}>
              Doctors
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              {showAdmin && (
                <li>
                  <NavLink to="/admin" className="btn-nav btn-nav-admin" onClick={closeMenu}>
                    Admin
                  </NavLink>
                </li>
              )}
              <li>
                <button className="btn-nav" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="btn-nav btn-nav-login"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className="btn-nav btn-nav-signup"
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;