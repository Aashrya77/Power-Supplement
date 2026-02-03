import React from "react";
import "./StoreLocations.css";
import { MapPin, Phone, Clock } from "lucide-react";

const StoreLocations = () => {
  // Store location data - you can update this with actual store information
  const stores = [
    {
      id: 1,
      name: "Power Supplement - Kathmandu",
      location: "New Road, Kathmandu, Nepal",
      phone: "+977-9851345820",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 2,
      name: "Rs Supplement",
      location: "Kumaripati, Lalitpur, Nepal",
      phone: "+977-9851345820",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://www.google.com/maps/place/Rs+Supplement/@27.6721953,85.2978155,15z/data=!3m1!4b1!4m6!3m5!1s0x39eb1900606e3d8d:0x916bc89f0d6cd0ad!8m2!3d27.6721775!4d85.3162696!16s%2Fg%2F11xw27xnbm?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      id: 3,
      name: "Rs Supplement",
      location: "Kamal Pokhari, Kathamandu, Nepal",
      phone: "+977-9842222220",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://www.google.com/maps/place/RS+Supplement/@27.7121496,85.3237819,17z/data=!3m1!4b1!4m6!3m5!1s0x39eb19a93a925823:0x4e9e919d7bda187b!8m2!3d27.7121449!4d85.3263568!16s%2Fg%2F11sq5kt8bf?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3Dhttps://www.google.com/maps/place/RS+Supplement/@27.7121496,85.3237819,17z/data=!3m1!4b1!4m6!3m5!1s0x39eb19a93a925823:0x4e9e919d7bda187b!8m2!3d27.7121449!4d85.3263568!16s%2Fg%2F11sq5kt8bf?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      id: 4,
      name: "Rise Fitness by Kamal",
      location: "Jawalakhel, Pokhara, Nepal",
      phone: "+977-9801234569",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 5,
      name: "Rs Supplement",
      location: "Damak, Jhapa, Nepal",
      phone: "+977-9801234570",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://www.google.com/maps/place/Rs+supplements/@26.6598621,87.6974959,17z/data=!3m1!4b1!4m6!3m5!1s0x39e591a3dded343d:0xb6a1429f6d204cfa!8m2!3d26.6598573!4d87.7000708!16s%2Fg%2F11kpl51hvb?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      id: 6,
      name: "Shrestha Supplement",
      location: "Chitwan, Nepal",
      phone: "+977-9845049280",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 7,
      name: "Invictus Fitness",
      location: "Jadibuti, Kathamndu, Nepal",
      phone: "+977-9801234572",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 8,
      name: "M.B Fitness pvt.ltd",
      img: '/butwal.jpg',
      location: "Kalika chok, Butwal, Nepal",
      phone: "+977-9867586576",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 9,
      name: "Revive Supplement",
      location: "Baneshwor, Kathamandu, Nepal",
      phone: "+977-9843567690",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.app.goo.gl/ChfPuD2ouhgWEp4a8"
    },
    {
      id: 10,
      name: "Peak x Supplement",
      location: "Mukti Marga, Banepa, Nepal",
      phone: "+977-9801115030",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.app.goo.gl/JbNmqz1kUfoUCZJC9"
    },
    {
      id: 11,
      name: "Power Pack Supplement",
      location: "Mukti Marga, Bhaktapur, Nepal",
      phone: "+977-9709390747",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 12,
      name: "MK Nutrition",
      img: '/butwal.jpg',
      location: "Bafal,Kalanki,Kathmandu",
      phone: "+977-9823397746",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },


  ];

  return (
    <div className="store-locations">
      <div className="store-locations-header">
        <h1>STORE LOCATIONS</h1>
        <p className="store-locations-subtitle">
          Visit us at any of our locations across Nepal
        </p>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <div className="store-card" key={store.id}>
            <div className="store-card-header">
              {store.img && <img src={store.img} alt="" width={30} height={30}/>}
              
              <h3>{store.name}</h3>
            </div>
            
            <div className="store-details">
              <div className="store-detail-item">
                <MapPin className="store-icon" size={20} />
                <div className="store-detail-text">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{store.location}</span>
                </div>
              </div>

              <div className="store-detail-item">
                <Phone className="store-icon" size={20} />
                <div className="store-detail-text">
                  <span className="detail-label">Phone</span>
                  <a href={`tel:${store.phone}`} className="detail-value phone-link">
                    {store.phone}
                  </a>
                </div>
              </div>

              <div className="store-detail-item">
                <Clock className="store-icon" size={20} />
                <div className="store-detail-text">
                  <span className="detail-label">Hours</span>
                  <span className="detail-value">{store.hours}</span>
                </div>
              </div>
            </div>

            <a 
              href={store.mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-map-btn"
            >
              View on Map
            </a>
          </div>
        ))}
      </div>

      <div className="store-locations-cta">
        <h3>Can't find a store near you?</h3>
        <p>We're expanding across Nepal. Shop online and get delivery to your doorstep!</p>
        <button className="shop-online-btn" onClick={() => window.location.href = '/shop-all'}>
          Shop Online
        </button>
      </div>
    </div>
  );
};

export default StoreLocations;
