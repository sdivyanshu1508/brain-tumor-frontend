import React from "react";
import "./about.css";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <h1>About NeuroScan AI</h1>
        <p>
          Transforming brain tumor diagnosis with the power of Artificial Intelligence
        </p>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to assist healthcare professionals by providing fast,
          accurate, and AI-powered tools for brain tumor detection. We aim to
          reduce diagnosis time and improve patient outcomes through advanced
          deep learning technologies.
        </p>
      </section>

      {/* WHAT WE DO */}
      <section className="about-section">
        <h2>What We Do</h2>
        <p>
          NeuroScan AI analyzes MRI scans using Convolutional Neural Networks (CNN)
          and segmentation models like U-Net to detect and highlight tumor regions.
          The platform provides:
        </p>

        <ul>
          <li>✔ Tumor Detection</li>
          <li>✔ Tumor Segmentation</li>
          <li>✔ Area Calculation</li>
          <li>✔ Detailed Patient Reports</li>
        </ul>
      </section>

      {/* TECHNOLOGY */}
      <section className="about-section">
        <h2>Technology Used</h2>
        <p>
          Our system is built using modern full-stack and AI technologies:
        </p>

        <ul>
          <li>Frontend: React.js</li>
          <li>Backend: Flask (Python)</li>
          <li>Machine Learning: TensorFlow, CNN, U-Net</li>
          <li>Image Processing: OpenCV, NumPy</li>
          <li>API Communication: Axios</li>
        </ul>
      </section>

      {/* WHY US */}
      <section className="about-section">
        <h2>Why Choose Us</h2>
        <ul>
          <li>⚡ Fast and accurate predictions</li>
          <li>🧠 AI-driven insights</li>
          <li>📊 Easy-to-understand reports</li>
          <li>🔒 Secure patient data handling</li>
          <li>💡 User-friendly interface</li>
        </ul>
      </section>

      {/* DISCLAIMER */}
      <section className="about-section disclaimer">
        <h2>Medical Disclaimer</h2>
        <p>
          NeuroScan AI is designed for educational and research purposes only.
          It does not replace professional medical advice, diagnosis, or treatment.
          Always consult a qualified healthcare provider for medical decisions.
        </p>
      </section>

    </div>
  );
}

export default About;