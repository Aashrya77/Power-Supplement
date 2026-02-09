import React from "react";
import "./TeamPower.css";
import StepsSection from "./Steps";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { FaStar, FaUsers, FaDollarSign, FaGift, FaArrowRight } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'
const TeamPower = () => {
  const benefits = [
    {
      icon: <FaDollarSign />,
      title: "Earn Commission",
      description: "Get rewarded for every sale with competitive commission rates"
    },
    {
      icon: <FaGift />,
      title: "Exclusive Discounts",
      description: "Access special pricing on all Power Supplement products"
    },
    {
      icon: <FaUsers />,
      title: "Community Support",
      description: "Join a network of like-minded athletes and creators"
    },
    {
      icon: <FaStar />,
      title: "Brand Recognition",
      description: "Get featured on our social media and marketing materials"
    }
  ];

  const navigate = useNavigate()

  return (
    <div className="team">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="team-content">
          <div className="hero-badge">EXCLUSIVE OPPORTUNITY</div>
          <h1>Join Team Power</h1>
          <p>
            Become part of an elite community of creators, athletes, and fitness enthusiasts. 
            We're building more than just partnerships – we're creating a movement for growth, 
            success, and achieving your ultimate potential.
          </p>
          {/* <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Partners</span>
            </div>
            <div className="stat">
              <span className="stat-number">$50K+</span>
              <span className="stat-label">Monthly Commissions</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div> */}
          <button className="join-btn" onClick={() => navigate('/underContruction')}>
            JOIN TEAM POWER <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Join Team Power?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swiper for big3 images */}
   {/* Original Layout for Large Screens */}
   <div className="big3 big3-desktop">
        <img src="/Big3(1).jpg" alt="" />
        <img src="/Big3.jpg" alt="" />
        <img src="/WhatsApp Image 2025-11-07 at 22.21.32_cc66a559.jpg" alt="" />
      </div>

      {/* Swiper for Small Screens */}
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        modules={[Pagination, Navigation]}
        className="big3-mobile"
      >
        <SwiperSlide><img src="/Big3(1).jpg" alt="Big 3 - 1" /></SwiperSlide>
        <SwiperSlide><img src="/Big3.jpg" alt="Big 3 - 2" /></SwiperSlide>
        <SwiperSlide><img src="/WhatsApp Image 2025-11-07 at 22.21.32_cc66a559.jpg" alt="Big 3 - 3" /></SwiperSlide>
      </Swiper>


      <section className="team-cta">
        <div className="container">
          <h2>Who Is Right For Team Power?</h2>
          <p>
            Whether you're a content creator, athlete, bodybuilder, runner, or fitness enthusiast – 
            if you're passionate about your craft and committed to excellence, you belong with us. 
            Our community transcends traditional boundaries and welcomes all forms of fitness dedication.
          </p>
          <div className="ideal-candidates">
            <div className="candidate-type">
              <h4>Content Creators</h4>
              <p>Influencers, YouTubers, and social media personalities</p>
            </div>
            <div className="candidate-type">
              <h4>Athletes</h4>
              <p>Professional and amateur athletes across all sports</p>
            </div>
            <div className="candidate-type">
              <h4>Fitness Enthusiasts</h4>
              <p>Dedicated gym-goers and fitness lifestyle advocates</p>
            </div>
          </div>
          <button className="cta-btn" onClick={() => navigate('/underContruction')}>Apply Now <FaArrowRight /></button>
        </div>
      </section>
      <section className="signup-process">
        <div className="container">
          <h2>How Do I Sign Up?</h2>
          <p>Getting started is simple. Follow these three easy steps to join Team Power.</p>
        </div>
      </section>
      <StepsSection />
      
      <section className="team-gallery">
        <div className="container">
          <h2>Meet Team Power</h2>
          <p>See our amazing community of athletes and creators in action</p>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/TeamPower.jpeg" alt="Team Power Member" />
              <div className="gallery-overlay">
                <span>Power Athlete</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/contentcreator.png" alt="Team Power Member" />
              <div className="gallery-overlay">
                <span>Content Creator</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/saru.jpg" alt="Team Power Member" />
              <div className="gallery-overlay"> 
                <span>Fitness Influencer</span>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/Akash.jpg" alt="Team Power Member" />
              <div className="gallery-overlay">
                <span>Professional Athlete</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default TeamPower;
