import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

/**
 * A soft watercolor wash: large translucent radial blobs in sage,
 * lavender and gold floating over the warm cream background.
 */
export function WatercolorBackground({ children }: { children?: React.ReactNode }) {
  const theme = useTheme();
  const { washSage, washLavender, washGold, background } = theme.colors;

  return (
    <View style={[styles.fill, { backgroundColor: background }]}>
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient id="sage" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={washSage} />
            <Stop offset="100%" stopColor={washSage} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="lavender" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={washLavender} />
            <Stop offset="100%" stopColor={washLavender} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="gold" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={washGold} />
            <Stop offset="100%" stopColor={washGold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={60} cy={90} rx={260} ry={230} fill="url(#lavender)" />
        <Ellipse cx={390} cy={250} rx={280} ry={260} fill="url(#sage)" />
        <Ellipse cx={80} cy={620} rx={300} ry={280} fill="url(#gold)" />
        <Ellipse cx={360} cy={760} rx={260} ry={240} fill="url(#lavender)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
