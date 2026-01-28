import React, { useState } from "react";
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
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const leadership = [
    {
      name: "Sohan Shrestha",
      title: "Founder/CEO/Board of Director",
      bio: "Leading the vision and long-term growth of Power Supplement.",
      description: "With over 15 years of experience in the fitness and supplement industry, Sohan founded Power Supplement with a mission to deliver premium quality products to athletes and fitness enthusiasts across Nepal and beyond. His strategic vision has transformed the company into a market leader, focusing on innovation, customer satisfaction, and community building. Sohan is passionate about empowering athletes to achieve their fitness goals through science-backed supplementation and mentorship.",
      image: "/sohan.webp",
    },
    {
      name: "Sagar Shrestha",
      title: "Managing Director (MD)",
      bio: "Overseeing operations, partnerships, and team execution.",
      description: "Sagar brings a wealth of operational expertise and business acumen to Power Supplement. As Managing Director, he oversees day-to-day operations, manages key partnerships, and ensures seamless execution of company initiatives. With a background in supply chain management and business development, Sagar has been instrumental in scaling the company's distribution network and establishing strong relationships with retailers and wholesale partners across the region.",
      image: "/sagar.png",
    },
  ];

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  const navigate = useNavigate()

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  React.useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

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

      {isModalOpen && selectedMember && (
        <div className="leader-modal-overlay" onClick={closeModal}>
          <div className="leader-modal-wrapper">
            <button className="leader-modal-close" onClick={closeModal}>×</button>
            <div className="leader-modal" onClick={(e) => e.stopPropagation()}>
              <div className="leader-modal-content">
                <div className="leader-modal-media">
                  {selectedMember.image ? (
                    <img src={selectedMember.image} alt={selectedMember.name} className="leader-modal-photo" />
                  ) : (
                    <div className="leader-modal-avatar">
                      {getInitials(selectedMember.name)}
                    </div>
                  )}
                </div>
                <div className="leader-modal-info">
                  <h2 className="leader-modal-name">{selectedMember.name}</h2>
                  <div className="leader-modal-title">{selectedMember.title}</div>
                  <p className="leader-modal-bio">{selectedMember.bio}</p>
                  {selectedMember.description && (
                    <p className="leader-modal-description">{selectedMember.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="leadership-section">
        <div className="container">
          <h2>Leadership</h2>
          <p className="leadership-subtitle">
            Meet the people guiding Power Supplement.
          </p>
          <div className="leadership-grid">
            {leadership.map((member, index) => (
              <div key={index} className="leader-card" onClick={() => openModal(member)} style={{ cursor: 'pointer' }}>
                <div className="leader-media">
                  {member.image ? (
                    <img className="leader-photo" src={member.image} alt={member.name} loading="lazy" />
                  ) : (
                    <div className="leader-avatar" aria-hidden="true">
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>
                <div className="leader-info">
                  <h3 className="leader-name">{member.name}</h3>
                  <div className="leader-title">{member.title}</div>
                  <p className="leader-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
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
