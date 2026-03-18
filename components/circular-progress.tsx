import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CircularProgressProps = {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  unit?: string;
};

export function CircularProgress({
  value,
  maxValue,
  size = 100,
  strokeWidth = 8,
  color,
  label,
  unit = "",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / maxValue, 1);
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.value, { color }]}>
          {value}
          {unit && <Text style={[styles.unit, { color }]}>{unit}</Text>}
        </Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
  },
  label: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
    lineHeight: 14,
  },
});
