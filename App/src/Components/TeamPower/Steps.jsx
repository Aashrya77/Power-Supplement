import React, { useState } from "react";
import "./TeamPower.css";

const StepsSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      step: "Step 1",
      title: "Fill Out Our Athlete Form",
      content:
        "Click the button above to bring you to our sign up page. Fill it out and submit it to our athlete team.",
      image: "WhatsApp Image 2025-11-07 at 22.22.19_6077a88e.jpg",
    },
    {
      id: 2,
      step: "Step 2",
      title: "Wait For Our Response",
      content:
        "Our athlete team will take a look at your application and make sure you fit into our team! You will receive an email or a DM if you have been accepted or not.",
      image: "DSC09475.jpg",
    },
    {
      id: 3,
      step: "Step 3",
      title: "Welcome To Team Power",
      content:
        "Looks like you got your approval email or DM? Welcome to Team BPI! Now you will receive your commission code and exclusive BPI discounts. And If you are a local athlete, be on the lookout for invites to our local shoots here in South Florida!",
      image: "DSC09478.jpg",
    },
  ];

  return (
    <div className="steps-container">
      <div className="steps-nav">
        {steps.map((step) => (
          <button
            key={step.id}
            className={activeStep === step.id ? "active-step" : ""}
            onClick={() => setActiveStep(step.id)}
          >
            {step.step}
          </button>
        ))}
      </div>
      <div className="step-content">
        <img
          src={steps.find((step) => step.id === activeStep)?.image}
          alt="Step"
          className="step-image"
        />
        <div className="step-des">
          <h3>{steps.find((step) => step.id === activeStep)?.title}</h3>
          <p>{steps.find((step) => step.id === activeStep)?.content}</p>
        </div>
      </div>
      
    </div>
  );
};

export default StepsSection;
