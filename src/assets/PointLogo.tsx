import React from "react";
import Svg, { Path, G, Defs, Mask } from "react-native-svg";

const PointLogo = ({ width = 190, height = 40 }) => {
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
        <Path opacity={0.82} d="M5 39V1" strokeWidth={10} />
        <Path opacity={0.82} d="M0 5.5H20C25 5.5 29.5 9 29.5 15S25 24.5 20 24.5H0" strokeWidth={9} />
        
        {/* O */}
        <Path opacity={0.82} d="M56.5 5.5C65.5 5.5 71 12 71 20S65.5 34.5 56.5 34.5 42 28 42 20 47.5 5.5 56.5 5.5" strokeWidth={10} />
        
        {/* I */}
        <Path opacity={0.82} d="M85 39V1" strokeWidth={10} />
        
        {/* N */}
        <Path opacity={0.82} d="M100.5 39V18C100.5 12.5 104.25 5.5 114.25 5.5 124.5 5.5 128 12.5 128 18V39" strokeWidth={10} />
        
        {/* T */}
        <Path opacity={0.82} d="M153 39V1" strokeWidth={10} />
        <Path opacity={0.82} d="M136 5.5H170" strokeWidth={9} />
      </G>
      
      {/* Logomark - grønne pile med mask */}
      <G mask="url(#mask_logomark)" stroke="#4FD300" strokeWidth={11.31} strokeLinecap="round">
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
      </G>
    </Svg>
  );
};

export default PointLogo;