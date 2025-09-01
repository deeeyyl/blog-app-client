import { useEffect, useState, useContext } from "react";
import BlogList from "../components/blogList";
import BlogModal from "../components/blogModal";
import { UserContext } from "../context/userContext";
import { notyf } from "../utilities/notyf";

function LandingPage() {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:4000/posts");
        if (!res.ok) throw new Error("Failed to load blogs");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        notyf.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading blogs...</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Welcome to BlogCom</h1>
      <p className="text-center text-muted">
        Explore blogs from our community by clicking and browsing from the cards below. Log in to share your thoughts!
      </p>

      <BlogList blogs={blogs} onBlogClick={(id) => setSelectedBlogId(id)} />

      {selectedBlogId && (
        <BlogModal
          blogId={selectedBlogId}
          onClose={() => setSelectedBlogId(null)}
        />
      )}
    </div>
  );
}

export default LandingPage;
