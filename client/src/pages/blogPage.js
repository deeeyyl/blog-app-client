import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../context/userContext";
import { notyf } from "../utilities/notyf";
import BlogModal from "../components/blogModal";
import BlogCard from "../components/blogCard";

function BlogsPage() {
  const { user, token } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const formRef = useRef(null);
  const cardRef = useRef(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:4000/posts");
      if (!res.ok) throw new Error("Failed to load blogs");
      const data = await res.json();

      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sorted);
    } catch (err) {
      notyf.error(err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!token) {
      notyf.error("You must be logged in to delete a blog!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete blog");

      setDeletingId(id);

      setTimeout(() => {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        setDeletingId(null);

        if (selectedBlogId === id) {
          setSelectedBlogId(null);
        }
      }, 300);

      notyf.success("Blog deleted successfully!");
    } catch (err) {
      notyf.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      notyf.error("You must be logged in to add a blog!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to add blog");

      const data = await res.json();

      const newPostWithAuthor = {
        ...data.post,
        author: { username: user.username },
      };

      setBlogs((prev) => [newPostWithAuthor, ...prev]);
      setHighlightId(newPostWithAuthor._id);
      setTimeout(() => setHighlightId(null), 2000);

      notyf.success("Blog added successfully!");
      setForm({ title: "", content: "" });
      collapseForm();
    } catch (err) {
      notyf.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => (showForm ? collapseForm() : expandForm());

  const expandForm = () => {
    if (formRef.current && cardRef.current) {
      const el = formRef.current;
      const card = cardRef.current;

      el.style.display = "block";
      el.style.height = "0px";
      el.style.opacity = "0";

      card.style.transform = "translateY(-20px) scale(0.95)";
      card.style.opacity = "0";

      const height = el.scrollHeight;
      requestAnimationFrame(() => {
        el.style.height = height + "px";
        el.style.opacity = "1";

        card.style.transform = "translateY(0) scale(1)";
        card.style.opacity = "1";
      });

      setShowForm(true);
    }
  };

  const collapseForm = () => {
    if (formRef.current && cardRef.current) {
      const el = formRef.current;
      const card = cardRef.current;

      el.style.height = el.scrollHeight + "px";
      card.style.transform = "translateY(0) scale(1)";
      card.style.opacity = "1";

      requestAnimationFrame(() => {
        el.style.height = "0px";
        el.style.opacity = "0";

        card.style.transform = "translateY(-20px) scale(0.95)";
        card.style.opacity = "0";
      });

      const transitionEnd = () => {
        el.style.display = "none";
        card.style.transform = "translateY(0) scale(1)";
        card.style.opacity = "1";
        el.removeEventListener("transitionend", transitionEnd);
      };
      el.addEventListener("transitionend", transitionEnd);

      setShowForm(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Our newest blogs</h2>

      {user && (
        <div className="mb-4">
          <button className="btn btn-primary mb-2" onClick={toggleForm}>
            {showForm ? "Cancel" : "Share your thoughts!"}
          </button>

          <div
            ref={formRef}
            style={{
              overflow: "hidden",
              height: "0px",
              display: "none",
              opacity: 0,
              transition: "height 0.3s ease, opacity 0.3s ease",
            }}
          >
            <div
              ref={cardRef}
              className="card shadow p-4 mt-2"
              style={{
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label>Content</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add Blog"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs available.</p>
      ) : (
        <div className="list-group">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className={`transform transition-all duration-500 ease-in-out ${
                deletingId === blog._id
                  ? "opacity-0 translate-x-5"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <BlogCard
                blog={blog}
                onClick={setSelectedBlogId}
                highlight={highlightId === blog._id}
                onDelete={() => handleDelete(blog._id)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedBlogId && (
        <BlogModal
          blogId={selectedBlogId}
          onClose={() => setSelectedBlogId(null)}
          onDelete={(deletedId) => {
            setBlogs((prevBlogs) =>
              prevBlogs.filter((b) => b._id !== deletedId)
            );
            setSelectedBlogId(null);
          }}
        />
      )}
    </div>
  );
}

export default BlogsPage;
