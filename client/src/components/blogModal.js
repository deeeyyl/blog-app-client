import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { notyf } from "../utilities/notyf";

function BlogModal({ blogId, onClose, onDelete }) {
  const { user, token } = useContext(UserContext);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");

  const BLOG_API_URL = "https://blog-app-server-a4gu.onrender.com/posts";
  const COMMENT_API_URL = "https://blog-app-server-a4gu.onrender.com/comments";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRes = await fetch(`${BLOG_API_URL}/${blogId}`);
        if (!blogRes.ok) throw new Error("Failed to fetch blog");
        const blogData = await blogRes.json();
        setBlog(blogData);

        const commentsRes = await fetch(`${COMMENT_API_URL}/${blogId}`);
        if (!commentsRes.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        notyf.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      notyf.error("You must be logged in to comment");
      return;
    }

    try {
      const res = await fetch(`${COMMENT_API_URL}/${blogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!res.ok) throw new Error("Failed to add comment");
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setCommentContent("");
      notyf.success("Comment added successfully");
    } catch (err) {
      notyf.error(err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${BLOG_API_URL}/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");
      notyf.success("Post deleted successfully");

      if (onDelete) onDelete(blogId);
      onClose();
    } catch (err) {
      notyf.error(err.message);
    }
  };

  if (loading) return null;
  if (!blog) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      onClick={onClose}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{blog.title}</h5>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <p className="text-muted mb-3">
              by {blog.author?.username || "Unknown"} •{" "}
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <p style={{ whiteSpace: "pre-line" }}>{blog.content}</p>

            <hr />

            <h6>Comments</h6>

            {user ? (
              <form onSubmit={handleAddComment} className="mb-3">
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    rows="3"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Comment
                </button>
              </form>
            ) : (
              <p className="text-muted mb-3">
                You must be logged in to comment.
              </p>
            )}

            <div className="d-flex flex-column gap-2">
              {comments.length === 0 && (
                <p className="text-muted">No comments yet</p>
              )}
              {comments.map((c) => (
                <div key={c._id} className="border rounded p-2 bg-light">
                  <small className="text-muted">
                    {c.author?.username || "User"}
                  </small>
                  <p className="mb-0">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            {user &&
              blog.author &&
              (blog.author._id === user._id || user.isAdmin) && (
                <button
                  className="btn btn-danger me-auto"
                  onClick={handleDeletePost}
                >
                  Delete Post
                </button>
              )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogModal;
