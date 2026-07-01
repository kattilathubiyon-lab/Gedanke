import { palette } from '@/constants/theme';
import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

/**
 * The Guter GeDANKE mark: a positive thought (speech bubble with a heart)
 * arrives on your phone and helps you grow (botanical leaves).
 */
export function Logo({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Phone */}
      <Rect
        x={34}
        y={20}
        width={52}
        height={86}
        rx={13}
        fill="#FFFFFF"
        stroke={palette.sageDeep}
        strokeWidth={4}
      />
      {/* Speaker */}
      <Line
        x1={52}
        y1={30}
        x2={68}
        y2={30}
        stroke={palette.sageDeep}
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* Home indicator */}
      <Line
        x1={52}
        y1={97}
        x2={68}
        y2={97}
        stroke={palette.sageDeep}
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* Speech bubble */}
      <Path
        d="M46 44 h28 a9 9 0 0 1 9 9 v10 a9 9 0 0 1 -9 9 h-15 l-8 8 v-8 h-5 a9 9 0 0 1 -9 -9 v-10 a9 9 0 0 1 9 -9 z"
        fill={palette.lavender}
      />
      {/* Heart inside the bubble */}
      <Path
        d="M60 66 c-1.2 -1.1 -7 -4.6 -7 -9 a4.1 4.1 0 0 1 7 -2.9 a4.1 4.1 0 0 1 7 2.9 c0 4.4 -5.8 7.9 -7 9 z"
        fill={palette.gold}
      />
      {/* Botanical stem growing from behind the phone (right) */}
      <Path
        d="M86 62 C 98 54, 102 42, 100 28"
        stroke={palette.sage}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M99 41 C 106 39, 110 33, 110 26 C 103 28, 99 34, 99 41 z" fill={palette.sage} />
      <Path d="M96 52 C 90 48, 88 42, 89 36 C 95 39, 97 46, 96 52 z" fill={palette.sage} />
      <Path d="M100 28 C 104 24, 105 19, 104 14 C 99 17, 98 23, 100 28 z" fill={palette.sageDeep} />
      {/* Small sprout on the left */}
      <Path
        d="M34 84 C 26 82, 21 76, 20 68"
        stroke={palette.sage}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M22 74 C 16 73, 12 69, 11 63 C 17 64, 21 68, 22 74 z" fill={palette.sage} />
      <Path d="M20 68 C 21 62, 19 57, 15 53 C 13 59, 15 65, 20 68 z" fill={palette.sageDeep} />
      {/* Little sparkle dots — the thought arriving */}
      <Circle cx={30} cy={38} r={2.4} fill={palette.gold} opacity={0.9} />
      <Circle cx={24} cy={47} r={1.7} fill={palette.lavenderDeep} opacity={0.8} />
      <Circle cx={92} cy={90} r={2.2} fill={palette.lavenderDeep} opacity={0.8} />
    </Svg>
  );
}
