import React, { useEffect } from "react";
import Svg, { Path, G, Defs, Mask } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

const AnimatedPointLogo = ({ width = 190, height = 40, onAnimationComplete }: { 
  width?: number; 
  height?: number; 
  onAnimationComplete?: () => void;
}) => {
  // Shared values for stroke-dashoffset animations
  const pLine = useSharedValue(38);
  const pCurve = useSharedValue(70.081);
  const oCircle = useSharedValue(91.998);
  const iLine = useSharedValue(38);
  const nPath = useSharedValue(83.765);
  const tLine = useSharedValue(38);
  const tTop = useSharedValue(38);
  
  // Heart animation
  const heartOpacity = useSharedValue(0);
  const heartScale = useSharedValue(0);

  useEffect(() => {
    // P animation
    pLine.value = withDelay(400, withTiming(0, { 
      duration: 150, 
      easing: Easing.bezier(0.42, 0, 1, 1) 
    }));
    pCurve.value = withDelay(450, withTiming(0, { 
      duration: 200, 
      easing: Easing.bezier(0, 0, 0.58, 1) 
    }));

    // O animation
    oCircle.value = withDelay(600, withTiming(0, { 
      duration: 250, 
      easing: Easing.bezier(0, 0, 1, 1) 
    }));

    // I animation
    iLine.value = withDelay(800, withTiming(0, { 
      duration: 150, 
      easing: Easing.bezier(0, 0, 1, 1) 
    }));

    // N animation
    nPath.value = withDelay(900, withTiming(0, { 
      duration: 250, 
      easing: Easing.bezier(0, 0, 1, 1) 
    }));

    // T animation
    tLine.value = withDelay(1100, withTiming(0, { 
      duration: 150, 
      easing: Easing.bezier(0, 0, 1, 1) 
    }));
    tTop.value = withDelay(1200, withTiming(0, { 
      duration: 600, 
      easing: Easing.bezier(0.42, 0, 1, 1) 
    }));

    // Heart animation
    heartOpacity.value = withDelay(1500, withTiming(0.7, { 
      duration: 300, 
      easing: Easing.bezier(0.42, 0, 1, 1) 
    }));
    heartScale.value = withDelay(1500, withTiming(1, { 
      duration: 300, 
      easing: Easing.back(1.2)
    }, () => {
      // Animation er færdig - vent 500ms ekstra, så kald callback
      if (onAnimationComplete) {
        setTimeout(() => {
          onAnimationComplete();
        }, 500);
      }
    }));
  }, []);

  // Animated props for each path
  const pLineProps = useAnimatedProps(() => ({
    strokeDasharray: "38",
    strokeDashoffset: pLine.value,
  }));

  const pCurveProps = useAnimatedProps(() => ({
    strokeDasharray: "70.081",
    strokeDashoffset: pCurve.value,
  }));

  const oCircleProps = useAnimatedProps(() => ({
    strokeDasharray: "91.998",
    strokeDashoffset: oCircle.value,
  }));

  const iLineProps = useAnimatedProps(() => ({
    strokeDasharray: "38",
    strokeDashoffset: iLine.value,
  }));

  const nPathProps = useAnimatedProps(() => ({
    strokeDasharray: "83.765",
    strokeDashoffset: nPath.value,
  }));

  const tLineProps = useAnimatedProps(() => ({
    strokeDasharray: "38",
    strokeDashoffset: tLine.value,
  }));

  const tTopProps = useAnimatedProps(() => ({
    strokeDasharray: "38",
    strokeDashoffset: tTop.value,
  }));

  const heartProps = useAnimatedProps(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 190 40"
      fill="none"
    >
      <Defs>
        <Mask id="mask_logomark" x="170" y="20" width="20" height="19" maskUnits="userSpaceOnUse">
          <Path fill="#ffffff" d="M180 39 190 29V20H170V29L180 39Z" />
        </Mask>
      </Defs>

      {/* POINT bogstaver */}
      <G stroke="#fff">
        {/* P */}
        <AnimatedPath
          opacity={0.82}
          d="M5 39V1"
          strokeWidth={10}
          animatedProps={pLineProps}
        />
        <AnimatedPath
          opacity={0.82}
          d="M0 5.5H20C25 5.5 29.5 9 29.5 15S25 24.5 20 24.5H0"
          strokeWidth={9}
          animatedProps={pCurveProps}
        />
        
        {/* O */}
        <AnimatedPath
          opacity={0.82}
          d="M56.5 5.5C65.5 5.5 71 12 71 20S65.5 34.5 56.5 34.5 42 28 42 20 47.5 5.5 56.5 5.5"
          strokeWidth={10}
          animatedProps={oCircleProps}
        />
        
        {/* I */}
        <AnimatedPath
          opacity={0.82}
          d="M85 39V1"
          strokeWidth={10}
          animatedProps={iLineProps}
        />
        
        {/* N */}
        <AnimatedPath
          opacity={0.82}
          d="M100.5 39V18C100.5 12.5 104.25 5.5 114.25 5.5 124.5 5.5 128 12.5 128 18V39"
          strokeWidth={10}
          animatedProps={nPathProps}
        />
        
        {/* T */}
        <AnimatedPath
          opacity={0.82}
          d="M153 39V1"
          strokeWidth={10}
          animatedProps={tLineProps}
        />
        <AnimatedPath
          opacity={0.82}
          d="M136 5.5H170"
          strokeWidth={9}
          animatedProps={tTopProps}
        />
      </G>
      
      {/* Animeret hjerte */}
      <AnimatedG
        mask="url(#mask_logomark)"
        stroke="#4FD300"
        strokeWidth={11.31}
        strokeLinecap="round"
        animatedProps={heartProps}
      >
        {/* Peger til højre */}
        <G opacity={0.7}>
          <Path d="M180 31 184.25 26.75" />
          <Path d="M180 31 176 35" />
        </G>
        {/* Peger til venstre */}
        <G opacity={0.7}>
          <Path d="M180 31 175.75 26.75" />
          <Path d="M180 31 184 35" />
        </G>
      </AnimatedG>
    </Svg>
  );
};

export default AnimatedPointLogo;