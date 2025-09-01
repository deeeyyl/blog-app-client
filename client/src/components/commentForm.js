import React, { useState } from "react";

function CommentForm({ onAddComment }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddComment(content);
    setContent("");
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Comment
      </button>
    </form>
  );
}

export default CommentForm;
