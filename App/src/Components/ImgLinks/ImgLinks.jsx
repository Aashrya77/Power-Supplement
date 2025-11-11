import React from "react";
import "./ImgLinks.css";
import {Link} from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import {ScrollTrigger} from 'gsap/all'
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger, useGSAP) 
const ImgLinks = () => {
  const imgRef = useRef()
  useGSAP(() => {
    
      gsap.fromTo(".grid-item", {
      opacity: 0,
      
    }, {
      opacity: 1,
      ease: 'power1.inOut',
      duration: .3,
      stagger: .3,
      scrollTrigger: {
        trigger: '.grid-item',
        start: "top 80%",
        id: 'imgId',
        toggleActions: 'play none none none'
      }
    })
    
   
  }, {scope: imgRef})

  const imgs = [
    {
      id: 1,
      img: "/pre-workout.png", // Adjust the image paths
      name: "Pre-Workout",
      link: "/collections/pre-workout",
    },
    {
      id: 2,
      img: "/fatBurners.png",
      name: "Fat Burners",
      link: "/fat-burner",
    },
    {
      id: 3,
      img: "/protein.png",
      name: "Protein",
      link: "/protein",
    },
    {
      id: 4,
      img: "/aminos.png",
      name: "Aminos",
      link: "/aminos",
    },
    {
      id: 5,
      img: "/RECOVERY.png",
      name: "Recovery",
      link: "/recovery",
    },

    {
      id: 6,
      img: "/ShopAll.png",
      name: "Shop All",
      link: "/shop-all",
    },
  ];

  return (
    <div className="img-container" ref={imgRef}>
    <div className="img-links">
      {imgs.map((item) => (
        <div key={item.id} className="grid-item">
        <Link to={item.link}>
        <img src={item.img} alt={item.name} />
        </Link>
          
          {/* <div className="label">{item.name}</div> */}
        </div>
      ))}
    </div>
    <span className="trueStrength">TRUE STRENGTH</span>
    </div>
    
  );
};

export default ImgLinks;
