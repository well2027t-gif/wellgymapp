import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CircularProgressProps {
  value: number;
  maxValue: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
}

export function CircularProgress({ value, maxValue, size, strokeWidth, color, label }: CircularProgressProps) {
  const percent = Math.min(value / maxValue, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.background, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: '#1A1A1A' }]} />
      <View style={styles.content}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  }
});
