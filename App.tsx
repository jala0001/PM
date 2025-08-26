import React, { useState } from "react";
import SplashScreen from "./src/screens/SplashScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return showSplash ? 
    <SplashScreen onAnimationComplete={handleSplashComplete} /> : 
    <DashboardScreen />;
}