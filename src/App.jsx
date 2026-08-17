import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Features from "./Pages/Features";
import Templates from "./Pages/Templates";
import Pricing from "./Pages/Pricing";
import CreateProfile from "./Pages/CreateProfile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import EditProfile from "./Pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/features"
          element={<Features />}
        />

        <Route
          path="/templates"
          element={<Templates />}
        />

        <Route
          path="/pricing"
          element={<Pricing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* PUBLIC PROFILE */}
        {/* QR code se koi bhi profile open kar sakta hai */}

        <Route
          path="/profile/:username"
          element={<Profile />}
        />
          <Route
  path="/edit-profile"
  element={<EditProfile />}
/>

        {/* PROTECTED ROUTES */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/create-profile"
            element={<CreateProfile />}
          />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;