import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PointLogo from "../assets/PointLogo";

const { width: screenWidth } = Dimensions.get('window');

export default function SplashScreen() {
  // Gør logoet responsivt - ca 80% af skærmbredden, men maksimalt 300px
  const logoWidth = Math.min(screenWidth * 0.8, 300);
  const logoHeight = (logoWidth * 40) / 190; // Bevar aspect ratio

  return (
    <View style={styles.container}>
      <PointLogo width={logoWidth} height={logoHeight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});