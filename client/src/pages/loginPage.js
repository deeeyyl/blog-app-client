import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { notyf } from "../utilities/notyf";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const { login } = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      notyf.success("Login successful!");
      navigate("/blogs");
    } catch (err) {
      notyf.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Link to register page */}
        <div className="text-center mt-3">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-primary fw-bold">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
