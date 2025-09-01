import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import LandingPage from "./pages/landingPage";
import BlogsPage from "./pages/blogPage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import MyPostsPage from "./pages/myPostsPage"
import { UserProvider } from "./context/userContext";
import { BlogProvider } from "./context/blogContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <BlogProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/my-posts" element={<MyPostsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BlogProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
