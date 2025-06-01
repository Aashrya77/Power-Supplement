import React from 'react'
import './Testimonials.css'
import { FaStar } from "react-icons/fa";
const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Aashrya S.',
            description: 'Excellent customer service and care'
        },
        {
            id: 2,
            name: 'Uday K.', 
            description: "My trusted brand!"
        },
        {
            id: 3,
            name: 'Ram P.',
            description: "On time and very prompt"
        }
    ]
  return (
    <div className="testimonials">
        {testimonials.map((test) => (
            <div className="test" key={test.id}>
                <div className="stars">
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                </div>
                <h3>{test.description}</h3>
                <p>-{test.name}</p>
            </div>
        ))}
    </div>
  )
}

export default Testimonials