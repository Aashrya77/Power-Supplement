import React from "react";
import "./Sponsors.css";
import { useNavigate } from "react-router-dom";

const Sponsors = () => {
  // Sample sponsor data - you can replace this with real sponsor data from API
  const sponsors = [
    {
      id: 1,
      name: "Spartan Sports",
      logo: "/spartan(1).jpeg",
      website: "https://spartansports.com",
      description: "Premium fitness supplements"
    },
    {
      id: 2,
      name: "PR Science",
      logo: "/pr science.jpeg", 
      website: "https://prscience.com",
      description: "Advanced sports nutrition"
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="Sponsors">
      <h1>OUR SPONSORS</h1>
      <p className="sponsors-subtitle">Trusted partners in your fitness journey</p>

      <div className="sponsors-grid">
        {sponsors.map((sponsor) => (
          <div className="sponsor-card" key={sponsor.id}>
            <a 
              href={sponsor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="sponsor-link"
            >
              <div className="sponsor-logo">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}

                />
              </div>
              <div className="sponsor-info">
                <h3>{sponsor.name}</h3>
                <p>{sponsor.description}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="sponsors-cta">
        <h3>Interested in becoming a sponsor?</h3>
        <p>Partner with us to reach fitness enthusiasts across Nepal</p>
        <button className="sponsor-contact-btn" onClick={() => navigate('/contact')}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default Sponsors;
