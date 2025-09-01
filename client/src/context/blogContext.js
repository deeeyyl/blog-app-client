import { createContext, useState, useEffect } from "react";

export const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://blog-app-server-a4gu.onrender.com/posts")
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, setBlogs }}>
      {children}
    </BlogContext.Provider>
  );
}
