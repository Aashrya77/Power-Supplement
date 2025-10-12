import React from "react";
import "./StoreLocations.css";
import { MapPin, Phone, Clock } from "lucide-react";

const StoreLocations = () => {
  // Store location data - you can update this with actual store information
  const stores = [
    {
      id: 1,
      name: "Power Supplement - Kathmandu (Main Branch)",
      location: "New Road, Kathmandu, Nepal",
      phone: "+977-9851345820",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 2,
      name: "Rs Supplement",
      location: "Kamal Pokhari, Kathamandu, Nepal",
      phone: "+977-9842222220",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 3,
      name: "Rise Fitness by Kamal",
      location: "Jawalakhel, Pokhara, Nepal",
      phone: "+977-9801234569",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 4,
      name: "Rs Supplement",
      location: "Damak, Jhapa, Nepal",
      phone: "+977-9801234570",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 5,
      name: "Shrestha Supplement",
      location: "Chitwan, Nepal",
      phone: "+977-9845049280",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    },
    {
      id: 6,
      name: "Inbigtus Fitness - Chitwan",
      location: "Jadibuti, Kathamndu, Nepal",
      phone: "+977-9801234572",
      hours: "9:00 AM - 8:00 PM",
      mapLink: "https://maps.google.com"
    }
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
