import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import PrivateLayout from "./PrivateLayout";

import Home from "./Home";
import About from "./pages/About";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Report from "./Report";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES (WITH NAVBAR + FOOTER) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* PRIVATE ROUTES (NO NAVBAR/FOOTER) */}
        <Route element={<PrivateLayout />}>
          <Route path="/admin-login" element={<Login role="admin" />} />
          <Route path="/doctor-login" element={<Login role="doctor" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;