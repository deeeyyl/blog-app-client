import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { notyf } from "../utilities/notyf";

function RegisterPage() {
  const { register } = useContext(UserContext);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      notyf.success("Registration successful! You may now login");
      navigate("/login");
    } catch (err) {
      const message =
        err.message.includes("exists") ||
        err.message.includes("taken") ||
        err.message.includes("registered")
          ? err.message
          : "Registration failed. Try again.";

      setError(message);
      notyf.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            className="btn btn-success w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Link to login page */}
        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Link to="/login" className="text-primary fw-bold">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
