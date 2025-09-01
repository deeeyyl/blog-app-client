import { useState } from "react";
import BlogModal from "./blogModal";

function BlogList({ blogs }) {
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [blogList, setBlogList] = useState(blogs); // local state for blogs

  if (!blogList || blogList.length === 0) {
    return <p className="text-gray-600">No blogs available.</p>;
  }

  const sortedBlogs = [...blogList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // 🗑️ handle deletion (remove from state so UI updates immediately)
  const handleDelete = (blogId) => {
    setBlogList((prev) => prev.filter((b) => b._id !== blogId));
    setSelectedBlogId(null); // close modal if deleted
  };

  return (
    <div className="list-group">
      {sortedBlogs.map((blog) => (
        <div
          key={blog._id}
          className="list-group-item list-group-item-action mb-2"
          style={{
            border:
              highlightId === blog._id ? "2px solid #0add7b" : "1px solid #ddd",
            borderRadius: "8px",
            transition: "border 0.5s ease",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlogId(blog._id)}
        >
          <h5>{blog.title}</h5>
          <small>by {blog.author?.username || "User"}</small>
        </div>
      ))}

      {selectedBlogId && (
        <BlogModal
          blogId={selectedBlogId}
          onClose={() => setSelectedBlogId(null)}
          onDelete={handleDelete} // 🔥 pass handler
        />
      )}
    </div>
  );
}

export default BlogList;
