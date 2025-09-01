function BlogCard({ blog, onClick, maxLength = 120, highlight = false }) {
  const getPreview = (content) => {
    if (!content) return "";
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div
      className="card shadow-sm mb-3"
      onClick={() => onClick(blog._id)}
      style={{
        border: highlight ? "2px solid #0add7b" : "1px solid #ddd",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
      }}
    >
      <div className="card-body">
        <h5 className="card-title">{blog.title}</h5>
        <small className="text-muted">by {blog.author?.username || "Unknown"}</small>
        <p className="card-text mt-2">{getPreview(blog.content)}</p>
      </div>
    </div>
  );
}

export default BlogCard;
