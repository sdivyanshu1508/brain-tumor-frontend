import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // we’ll create this
import Footer from "./components/Footer"; // optional (recommended)

function Layout() {
  return (
    <>
      <Navbar />
      
      {/* Page Content will load here */}
      <Outlet />

      <Footer />
    </>
  );
}

export default Layout;