import React, { useState } from "react";
import "./TeamPower.css";
import StepsSection from "./Steps";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
const TeamPower = () => {
 

  return (
    <div className="team">
      <section>
        <div className="team-content">
          <h1>Partner Program</h1>
          <p>
            Here at Power we want to create a community of creators, athletes,
            and like-minded individuals. We aim to create an environment for
            growth! Doing what we can to help you achieve your goals while also
            being apart of a fun and bright community!
          </p>
          <button className="join-btn">JOIN NOW</button>
        </div>
      </section>

      {/* Swiper for big3 images */}
   {/* Original Layout for Large Screens */}
   <div className="big3 big3-desktop">
        <img src="/Big3(1).jpg" alt="" />
        <img src="/Big3.jpg" alt="" />
        <img src="/Big3(2).jpg" alt="" />
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
        <SwiperSlide><img src="/Big3(2).jpg" alt="Big 3 - 3" /></SwiperSlide>
      </Swiper>


      <div className="team-cta">
        <h2>WHO IS RIGHT FOR THE POWER TEAM?</h2>
        <p>
          If you are a content creator or athlete that is passionate for your
          craft then you are right for the team! Bodybuilders, runners,
          creators, etc! We want our community to be more than just
          bodybuilding.
        </p>
        <div className="join-btn">Sign Me Up!</div>
      </div>
      <div className="howToSignUp">
        <h2>HOW DO I SIGN UP?</h2>
      </div>
      <StepsSection />
      <div className="teamPhotoes">
        <h1>TEAM POWER</h1>
        <div className="teamPhotoesImgs">
          <img src="\TeamPower.jpeg" alt="" />
          <img src="\TeamPower(1).jpeg" alt="" />
          <img src="\TeamPower(2).jpg" alt="" />
          <img src="\TeamPower(4).jpg" alt="" />
        </div>
      </div>
      
    </div>
  );
};

export default TeamPower;
