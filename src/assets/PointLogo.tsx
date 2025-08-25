import React from "react";
import Svg, { Path, G } from "react-native-svg";

const PointLogo = ({ width = 190, height = 40 }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 190 40"
      fill="none"
    >
      {/* "POINT" paths */}
      <G stroke="#fff" opacity={0.82}>
        {/* P */}
        <Path d="M5 39V1" strokeWidth={10} />
        <Path d="M0 5.5H20C25 5.5 29.5 9 29.5 15S25 24.5 20 24.5H0" strokeWidth={9} />
        {/* O */}
        <Path d="M56.5 5.5C65.5 5.5 71 12 71 20S65.5 34.5 56.5 34.5 42 28 42 20 47.5 5.5 56.5 5.5" strokeWidth={10} />
        {/* I */}
        <Path d="M85 39V1" strokeWidth={10} />
        {/* N */}
        <Path d="M100.5 39V18C100.5 12.5 104.25 5.5 114.25 5.5 124.5 5.5 128 12.5 128 18V39" strokeWidth={10} />
        {/* T */}
        <Path d="M153 39V1" strokeWidth={10} />
        <Path d="M136 5.5H170" strokeWidth={9} />
      </G>

      {/* Grønt hjerte — rigtig path fra Figma */}
      <Path
        d="M180 20
           C180 17 185 17 185 20
           C185 22 182 23.5 180 25.5
           C178 23.5 175 22 175 20
           C175 17 180 17 180 20Z"
        fill="#4FD300"
      />
    </Svg>
  );
};

export default PointLogo;
