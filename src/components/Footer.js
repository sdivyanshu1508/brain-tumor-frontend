import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">

  {/* DISCLAIMER */}
  <div className="footer-disclaimer">
    DISCLAIMER: This tool is for investigational use and educational purposes only.
    It does not provide medical diagnoses or advice. Please consult a qualified healthcare professional.
  </div>

  <div className="footer-container">

    {/* LEFT */}
    <div className="footer-col">
      <h2 className="logo">NeuroScan AI</h2>
      <p>AI-Powered Brain Tumor Diagnosis & Insights.</p>

      <p>📍 140 AI Innovation Drive,<br/>San Francisco, CA 94105</p>
      <p onClick={() => window.open("tel:+91XXXXXXXXXX")}>
  📞 +91 XXXXX XXXXX
</p>

<p onClick={() => window.open("mailto:contact@neuroscan.ai")}>
  📧 contact@neuroscan.ai
</p>
    </div>

    {/* EXPLORE */}
    <div className="footer-col">
  <h4>Explore</h4>
  <p onClick={() => navigate("/")}>Home</p>
  <p onClick={() => navigate("/about")}>About Us</p>
  <p onClick={() => navigate("/technology")}>Our AI Technology</p>
  <p onClick={() => navigate("/how-it-works")}>How it Works</p>
  <p onClick={() => navigate("/diagnosis")}>Diagnosis Process</p>
  <p onClick={() => navigate("/faq")}>FAQs</p>
  <p onClick={() => navigate("/research")}>Research</p>
</div>

    {/* COMPANY */}
    <div className="footer-col">
  <h4>Company</h4>
  <p onClick={() => navigate("/careers")}>Careers</p>
  <p onClick={() => navigate("/team")}>Team</p>
  <p onClick={() => navigate("/providers")}>For Healthcare Providers</p>
  <p onClick={() => navigate("/patients")}>For Patients</p>
  <p onClick={() => navigate("/partnerships")}>Partnerships</p>
  <p onClick={() => navigate("/blog")}>Blog</p>
</div>

    {/* LEGAL */}
    <div className="footer-col">
  <h4>Legal & Resources</h4>
  <p onClick={() => navigate("/terms")}>Terms of Use</p>
  <p onClick={() => navigate("/privacy")}>Privacy Policy</p>
  <p onClick={() => navigate("/compliance")}>FDA Clearance & Compliance</p>
  <p onClick={() => navigate("/disclaimer")}>Disclaimer</p>
  <p onClick={() => navigate("/regulatory")}>Regulatory Info</p>
  <p onClick={() => navigate("/support")}>Contact Support</p>
</div>
</div>

  {/* BOTTOM */}
  <div className="footer-bottom">
    © 2026 NeuroScan AI Inc. All Rights Reserved.
    <div className="footer-links">
      <span onClick={() => navigate("/terms")}>
    Terms & Conditions
      </span>

      <span onClick={() => navigate("/privacy")}>
    Privacy Policy
      </span>

      <span onClick={() => navigate("/sitemap")}>
    Site Map
      </span>
    </div>

<div className="footer-socials">
  <a href="https://linkedin.com" target="_blank" rel="noreferrer">
    <FaLinkedin />
  </a>

  <a href="https://github.com" target="_blank" rel="noreferrer">
    <FaGithub />
  </a>

  <a href="https://twitter.com" target="_blank" rel="noreferrer">
    <FaTwitter />
  </a>

  <a href="mailto:contact@neuroscan.ai">
    <FaEnvelope />
  </a>
</div>
  </div>

</footer>
  );
}

export default Footer;