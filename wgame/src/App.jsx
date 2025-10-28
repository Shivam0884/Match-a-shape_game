import { Routes, Route } from "react-router-dom";
import Home from "./Home/home";
import Navbar from "./Home/navbar";
import About from "./components/about";
import User from "./components/user";
import Signup from "./components/signup";
import Login from "./components/login";
import Game from "./components/game";

function App() {
  return (
    <>
      {/* Navbar visible on all pages */}

      {/* Page content changes based on route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
        <Route path="/user" element={<User />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
