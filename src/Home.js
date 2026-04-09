import React, { useState,useEffect } from "react";
import "./home.css";

function Home() {
  function TypingText() {
  const text = "AI-Powered Brain Tumor Detection";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <h1 className="typing">{displayed}|</h1>;
}

    const testimonials = [
  {
    name: "Dr. Evelyn Reed",
    role: "Chief Neuroradiologist",
    text: "Diagnostic accuracy has significantly improved.",
    img: "/doctors/doc1.jpeg"
  },
  {
    name: "Dr. Marcus Chen",
    role: "Neuroscientist",
    text: "Speed and insights are incredible.",
    img: "/doctors/doc2.jpeg"
  },
  {
    name: "Dr. Sarah Patel",
    role: "Neurologist",
    text: "Game changer for early detection.",
    img: "/doctors/doc3.jpeg"
  },
  {
    name: "Dr. Eleanor Vance",
    role: "Chief Neuroradiologist",
    text: "Diagnostic accuracy has significantly improved.",
    img: "/doctors/doc1.jpeg"
  },
  {
    name: "Dr. Aliyah Khan",
    role: "Neuroscientist",
    text: "Speed and insights are incredible.",
    img: "/doctors/doc2.jpeg"
  },
  {
    name: "Dr. Samuel Park",
    role: "Neurologist",
    text: "Game changer for early detection.",
    img: "/doctors/doc3.jpeg"
  },
  {
    name: "Dr. Chloe Dubois",
    role: "Chief Neuroradiologist",
    text: "Diagnostic accuracy has significantly improved.",
    img: "/doctors/doc1.jpeg"
  },
  {
    name: "Dr. Julian Croft",
    role: "Neuroscientist",
    text: "Speed and insights are incredible.",
    img: "/doctors/doc2.jpeg"
  },
  {
    name: "Dr. Beatriz Rossi",
    role: "Neurologist",
    text: "Game changer for early detection.",
    img: "/doctors/doc3.jpeg"
  },
  {
    name: "Dr. Kenji Tanaka",
    role: "Chief Neuroradiologist",
    text: "Diagnostic accuracy has significantly improved.",
    img: "/doctors/doc1.jpeg"
  },
  {
    name: "Dr. Sarah Jenkins",
    role: "Neuroscientist",
    text: "Speed and insights are incredible.",
    img: "/doctors/doc2.jpeg"
  },
  {
    name: "Dr. Oliver Schmidt",
    role: "Neurologist",
    text: "Game changer for early detection.",
    img: "/doctors/doc3.jpeg"
  },
  {
    name: "Dr. Isaac Newton",
    role: "Chief Neuroradiologist",
    text: "Diagnostic accuracy has significantly improved.",
    img: "/doctors/doc1.jpeg"
  },
  {
    name: "Dr. Maria Garcia",
    role: "Neuroscientist",
    text: "Speed and insights are incredible.",
    img: "/doctors/doc2.jpeg"
  },
  {
    name: "Dr. Sophia Loren",
    role: "Neurologist",
    text: "Game changer for early detection.",
    img: "/doctors/doc3.jpeg"
  },
];

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [positions, setPositions] = useState([0,1,2,3,4]);

useEffect(() => {
  const interval = setInterval(() => {

    // 🔄 Rotate positions (animation)
    setPositions(prev => {
      const newPos = [...prev];
      const first = newPos.shift();
      newPos.push(first);
      return newPos;
    });

    // 🔄 Change to next 5 testimonials
    setTimeout(() => {
      setIndex(prev => (prev + 5) % testimonials.length);
    }, 800); // wait for animation to finish

  }, 3000);

  return () => clearInterval(interval);
}, []);

const visible = testimonials.slice(index, index + 5);

// loop fix
if (visible.length < 5) {
  visible.push(...testimonials.slice(0, 5 - visible.length));
}

  return (
    <div className="carousel">
  {visible.map((item, i) => (
    <div
      key={i}
      className={`card position-${positions[i]}`}
    >
      <div className="card-content">
        <img src={item.img} alt="" className="doc-img" />

        <div className="card-text">
          <p>"{item.text}"</p>
          <h4>{item.name}</h4>
          <span>{item.role}</span>
        </div>
      </div>
    </div>
  ))}
</div>
  );
}

  return (
    <div className="home">
    <div className="particles"></div>
      {/* HERO */}
      <div className="hero">
      <TypingText />
      <p>Advanced AI for faster, more accurate neuroimaging insights.</p>
      <button className="cta-btn">
      🚀 Try Detection
      </button>
      </div>

      {/* TESTIMONIALS */}
      <div className="testimonials">
        <TestimonialCarousel />
      </div>

      {/* CONTACT 
      <div className="contact">
        <h2>Get In Touch</h2>
        <p>+91 XXXXX XXXXX</p>
        <p>contact@neuroscan.ai</p>
      </div>
      */}

      

    </div>
  );
}

export default Home;