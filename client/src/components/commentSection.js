import { useEffect, useState } from "react";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/comments/${postId}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId]);

  if (comments.length === 0) {
    return <p className="text-muted fst-italic">No comments yet.</p>;
  }

  return (
    <div className="list-group mt-2">
      {comments.map(c => (
        <div key={c._id} className="list-group-item">
          <strong>{c.author.username}</strong>
          <p className="mb-0">{c.content}</p>
        </div>
      ))}
    </div>
  );
}
export default CommentSection;
