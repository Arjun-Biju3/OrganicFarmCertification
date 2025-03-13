import React from "react";

import './Home.css'
import HomeImage from "../../../assets/images/home.jpg";
import Button from "../FormElements/Button";

function Home() {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1>Welcome to Our Platform</h1>
        <p>Your journey starts here.</p>
        <Button to="/auth">Get Started</Button>
      </div>
    </div>
  );
}

export default Home;
