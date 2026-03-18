import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { MEALS, Meal } from "@/lib/data";

const TOTAL_CALORIES = 2300;
const TOTAL_PROTEIN = 195;
const TOTAL_CARBS = 240;
const TOTAL_FAT = 51;

export default function DietaScreen() {
  const [meals, setMeals] = useState<Meal[]>(MEALS);

  const toggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  const consumedCalories = meals
    .filter((m) => m.done)
    .reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = meals
    .filter((m) => m.done)
    .reduce((sum, m) => sum + m.protein, 0);
  const consumedCarbs = meals
    .filter((m) => m.done)
    .reduce((sum, m) => sum + m.carbs, 0);
  const consumedFat = meals
    .filter((m) => m.done)
    .reduce((sum, m) => sum + m.fat, 0);

  const caloriesProgress = Math.min(consumedCalories / TOTAL_CALORIES, 1);

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dieta de Hoje</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          activeOpacity={0.7}
          onPress={() => router.push("/create-diet" as any)}
        >
          <MaterialIcons name="edit" size={18} color="#22C55E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calories Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Calorias Consumidas</Text>
              <View style={styles.summaryCalories}>
                <Text style={styles.summaryCaloriesValue}>{consumedCalories}</Text>
                <Text style={styles.summaryCaloriesTotal}> / {TOTAL_CALORIES} kcal</Text>
              </View>
            </View>
            <View style={styles.summaryCircle}>
              <Text style={styles.summaryPercent}>
                {Math.round(caloriesProgress * 100)}%
              </Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${caloriesProgress * 100}%` as any },
              ]}
            />
          </View>
          {/* Macros */}
          <View style={styles.macros}>
            <MacroItem
              label="Proteína"
              value={consumedProtein}
              total={TOTAL_PROTEIN}
              color="#3B82F6"
              unit="g"
            />
            <MacroItem
              label="Carboidrato"
              value={consumedCarbs}
              total={TOTAL_CARBS}
              color="#F59E0B"
              unit="g"
            />
            <MacroItem
              label="Gordura"
              value={consumedFat}
              total={TOTAL_FAT}
              color="#EF4444"
              unit="g"
            />
          </View>
        </View>

        {/* Meals */}
        <Text style={styles.sectionTitle}>REFEIÇÕES</Text>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onToggle={() => toggleMeal(meal.id)} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

function MacroItem({
  label,
  value,
  total,
  color,
  unit,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  unit: string;
}) {
  const progress = Math.min(value / total, 1);
  return (
    <View style={macroStyles.container}>
      <Text style={macroStyles.label}>{label}</Text>
      <View style={macroStyles.bar}>
        <View
          style={[macroStyles.fill, { width: `${progress * 100}%` as any, backgroundColor: color }]}
        />
      </View>
      <Text style={macroStyles.value}>
        {value}
        <Text style={macroStyles.total}>/{total}{unit}</Text>
      </Text>
    </View>
  );
}

const macroStyles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  bar: {
    height: 4,
    backgroundColor: "#2A2A2A",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 18,
  },
  total: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "400",
  },
});

function MealCard({ meal, onToggle }: { meal: Meal; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[mealStyles.card, meal.done && mealStyles.cardDone]}>
      <TouchableOpacity
        style={mealStyles.header}
        activeOpacity={0.7}
        onPress={() => setExpanded((v) => !v)}
      >
        <TouchableOpacity
          style={[mealStyles.checkbox, meal.done && mealStyles.checkboxDone]}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          {meal.done && <MaterialIcons name="check" size={14} color="#000000" />}
        </TouchableOpacity>
        <View style={mealStyles.info}>
          <View style={mealStyles.row}>
            <Text style={[mealStyles.name, meal.done && mealStyles.nameDone]}>
              {meal.name}
            </Text>
            <View style={mealStyles.timeBadge}>
              <MaterialIcons name="access-time" size={11} color="#9CA3AF" />
              <Text style={mealStyles.time}>{meal.time}</Text>
            </View>
          </View>
          <Text style={mealStyles.calories}>{meal.calories} kcal</Text>
        </View>
        <MaterialIcons
          name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={mealStyles.items}>
          {meal.items.map((item, i) => (
            <View key={i} style={mealStyles.item}>
              <View style={mealStyles.itemDot} />
              <Text style={mealStyles.itemText}>{item}</Text>
            </View>
          ))}
          <View style={mealStyles.macroRow}>
            <Text style={mealStyles.macroText}>P: {meal.protein}g</Text>
            <Text style={mealStyles.macroText}>C: {meal.carbs}g</Text>
            <Text style={mealStyles.macroText}>G: {meal.fat}g</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const mealStyles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    overflow: "hidden",
  },
  cardDone: {
    borderColor: "rgba(34,197,94,0.3)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#4B5563",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  nameDone: {
    color: "#9CA3AF",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  time: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  calories: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    lineHeight: 18,
  },
  items: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#4B5563",
  },
  itemText: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 18,
  },
  macroRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  macroText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 30,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 10,
  },
  summaryCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 14,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
    lineHeight: 16,
  },
  summaryCalories: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  summaryCaloriesValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 34,
  },
  summaryCaloriesTotal: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  summaryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 2,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryPercent: {
    fontSize: 13,
    fontWeight: "800",
    color: "#22C55E",
    lineHeight: 18,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 3,
  },
  macros: {
    flexDirection: "row",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.5,
    marginTop: 4,
    lineHeight: 16,
  },
});
