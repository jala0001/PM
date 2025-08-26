import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Simple timer i stedet for callback
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Timer finished, switching to dashboard");
      setShowSplash(false);
    }, 3000); // 3 sekunder

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <DashboardScreen />;
}