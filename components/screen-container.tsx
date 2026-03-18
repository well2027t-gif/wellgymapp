import React from "react";
import { View, ViewProps, StyleSheet, Platform } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

const IS_WEB = Platform.OS === "web";
const MAX_WIDTH = 430; // iPhone Pro Max width

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
}

export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  ...props
}: ScreenContainerProps) {
  if (IS_WEB) {
    return (
      <View style={styles.webWrapper}>
        <View 
          style={[
            styles.webContainer,
            style
          ]}
          {...props}
        >
          <SafeAreaView 
            edges={edges} 
            style={styles.safeArea}
          >
            <View style={[styles.safeArea, { padding: 0 }]}>
              {children}
            </View>
          </SafeAreaView>
        </View>
      </View>
    );
  }

  return (
    <View
      className={cn(
        "flex-1",
        "bg-background",
        containerClassName
      )}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={style}
      >
        <View className={cn("flex-1", className)}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webContainer: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    height: "100%",
    maxHeight: 900,
    backgroundColor: "#050505",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#1A1A1A",
    overflow: "hidden",
    position: "relative",
  },
  safeArea: {
    flex: 1,
  },
});
