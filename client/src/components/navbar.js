import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { notyf } from "../utilities/notyf";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notyf.success("Successfully logged out!");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/blogs">BlogCom</Link>
        <div className="ms-auto">
          {!user ? (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="me-3">Hi, <strong>{user.username}</strong></span>
              <Link className="btn btn-outline-secondary me-2" to="/my-posts">
                My Posts
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
