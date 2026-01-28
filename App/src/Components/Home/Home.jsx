import React from 'react';
import './Home.css';
import LazyImage from '../LazyImage.jsx';
const Home = () => {
  return (
    <div className="home">
      
        <LazyImage src="/Originals/Originals/Homebg.webp" alt="Home background" className="home-hero" />
    </div>
  )
}

export default Home