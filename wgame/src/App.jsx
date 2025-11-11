import { Routes, Route } from "react-router-dom";
import Home from "./Home/home";
import About2 from "./components/about2";
import About1 from "./components/about";
import User from "./components/user";
import Signup from "./components/signup";
import Login from "./components/login";
import Game from "./components/game";
import StaticShapeGame from "./components/upLev";
import Dashboard from "./Home/dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about1" element={<About1 />} />
        <Route path="/about2" element={<About2 />} />
        <Route path="/user" element={<User />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/level1" element={<StaticShapeGame />} />
      </Routes>
    </>
  );
}

export default App;
