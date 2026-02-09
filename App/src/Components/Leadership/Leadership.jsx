import React, { useEffect, useState } from "react";
import "./Leadership.css";

const Leadership = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leadership = [
    {
      name: "Sohen Shrestha",
      title: "Founder/CEO/Board of Director",
      bio: "Leading the vision and long-term growth of Power Supplement.",
      description:
        "With over 15 years of experience in the fitness and supplement industry, Sohen founded Power Supplement with a mission to deliver premium quality products to athletes and fitness enthusiasts across Nepal and beyond. His strategic vision has transformed the company into a market leader, focusing on innovation, customer satisfaction, and community building. Sohen is passionate about empowering athletes to achieve their fitness goals through science-backed supplementation and mentorship.",
      image: "/sohan.webp",
    },
    {
      name: "Sagar Shrestha",
      title: "Managing Director (MD)",
      bio: "Overseeing operations, partnerships, and team execution.",
      description:
        "Sagar brings a wealth of operational expertise and business acumen to Power Supplement. As Managing Director, he oversees day-to-day operations, manages key partnerships, and ensures seamless execution of company initiatives. With a background in supply chain management and business development, Sagar has been instrumental in scaling the company's distribution network and establishing strong relationships with retailers and wholesale partners across the region.",
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

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && selectedMember && (
        <div className="leader-modal-overlay" onClick={closeModal}>
          <div className="leader-modal-wrapper">
            <button className="leader-modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="leader-modal" onClick={(e) => e.stopPropagation()}>
              <div className="leader-modal-content">
                <div className="leader-modal-media">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="leader-modal-photo"
                    />
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
                    <p className="leader-modal-description">
                      {selectedMember.description}
                    </p>
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
          <p className="leadership-subtitle">Meet the people guiding Power Supplement.</p>
          <div className="leadership-grid">
            {leadership.map((member, index) => (
              <div
                key={index}
                className="leader-card"
                onClick={() => openModal(member)}
                style={{ cursor: "pointer" }}
              >
                <div className="leader-media">
                  {member.image ? (
                    <img
                      className="leader-photo"
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                    />
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
    </>
  );
};

export default Leadership;
