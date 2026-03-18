import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "plus": "add",
  "fork.knife": "restaurant",
  "camera.fill": "photo-camera",
  "target": "track-changes",
  "flame.fill": "local-fire-department",
  "clock": "access-time",
  "checkmark.circle.fill": "check-circle",
  "circle": "radio-button-unchecked",
  "xmark": "close",
  "arrow.left": "arrow-back",
  "chart.line.uptrend.xyaxis": "trending-up",
  "person.fill": "person",
  "star.fill": "star",
  "bolt.fill": "bolt",
  "drop.fill": "water-drop",
  "figure.walk": "directions-walk",
  "dumbbell.fill": "fitness-center",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
