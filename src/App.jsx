import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Features from "./Pages/Features";
import Templates from "./Pages/Templates";
import Pricing from "./Pages/Pricing";
import CreateProfile from "./Pages/CreateProfile";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;