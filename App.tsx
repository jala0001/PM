import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

type AppScreen = 'splash' | 'login' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');

  // Splash screen timer - skifter til login efter 3 sekunder
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        console.log("Timer finished, switching to login");
        setCurrentScreen('login');
      }, 3000); // 3 sekunder

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Handle login completion
  const handleLoginContinue = (phoneNumber: string) => {
    console.log("📱 Login completed with phone:", phoneNumber);
    // Her ville vi normalt tjekke API'et om nummeret eksisterer
    // For nu går vi bare videre til dashboard
    setCurrentScreen('dashboard');
  };

  // Render current screen
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    
    case 'login':
      return <LoginScreen onContinue={handleLoginContinue} />;
    
    case 'dashboard':
      return <DashboardScreen />;
    
    default:
      return <SplashScreen />;
  }
}