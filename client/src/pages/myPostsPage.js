import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import BlogModal from "../components/blogModal";
import BlogCard from "../components/blogCard";

function MyPostsPage() {
  const { token } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [removingPostId, setRemovingPostId] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch("http://localhost:4000/posts/my-posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [token]);

  // 🔥 Called from BlogModal when a post is deleted
  const handleDeletePost = (postId) => {
    setRemovingPostId(postId);

    // Wait for CSS animation to finish (300ms), then remove
    setTimeout(() => {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setRemovingPostId(null);
    }, 300);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="list-group">
          {posts.map((post) => (
            <div
              key={post._id}
              className={`transition-card ${
                removingPostId === post._id ? "removing" : ""
              }`}
            >
              <BlogCard
                blog={post}
                onClick={setSelectedPostId}
                highlight={false}
              />
            </div>
          ))}
        </div>
      )}

      {selectedPostId && (
        <BlogModal
          blogId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
          onDelete={handleDeletePost} // 👈 pass delete handler
        />
      )}
    </div>
  );
}

export default MyPostsPage;
