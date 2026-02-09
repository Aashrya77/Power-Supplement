import React from 'react';
import './Home.css';
import LazyImage from '../LazyImage.jsx';
const Home = () => {
  return (
    <div className="home">
      <div className="home-hero-wrapper">
        <LazyImage src="/Originals/Originals/gym.jpg.jpeg" alt="Home background" className="home-hero" />
        <div className="usa-import-badge">
          <div className="usa-import-badge-title">Imported from USA</div>
          <div className="usa-import-badge-subtitle">Authentic premium supplements</div>
        </div>
      </div>
    </div>
  )
}

export default Home