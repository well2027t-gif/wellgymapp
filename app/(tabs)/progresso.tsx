import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { PROGRESS_DATA, DEFAULT_GOAL } from "@/lib/data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 120;

type TabType = "peso" | "treinos" | "calorias";

export default function ProgressoScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("peso");

  const getChartData = () => {
    switch (activeTab) {
      case "peso":
        return {
          data: PROGRESS_DATA.weightHistory,
          label: "kg",
          color: "#3B82F6",
          title: "Evolução do Peso",
        };
      case "treinos":
        return {
          data: PROGRESS_DATA.workoutsPerWeek,
          label: "treinos",
          color: "#22C55E",
          title: "Treinos por Semana",
        };
      case "calorias":
        return {
          data: PROGRESS_DATA.caloriesPerWeek,
          label: "kcal",
          color: "#F59E0B",
          title: "Calorias por Semana",
        };
    }
  };

  const chartData = getChartData();
  const minVal = Math.min(...chartData.data);
  const maxVal = Math.max(...chartData.data);
  const range = maxVal - minVal || 1;

  const getY = (val: number) =>
    CHART_HEIGHT - ((val - minVal) / range) * (CHART_HEIGHT - 20) - 10;

  const pointSpacing = CHART_WIDTH / (chartData.data.length - 1);

  // Build SVG path
  const pathD = chartData.data
    .map((val, i) => `${i === 0 ? "M" : "L"} ${i * pointSpacing} ${getY(val)}`)
    .join(" ");

  const goal = DEFAULT_GOAL;
  const weightProgress =
    (goal.startWeight - goal.currentWeight) /
    (goal.startWeight - goal.goalWeight);

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meu Progresso</Text>
        <View style={styles.streakBadge}>
          <MaterialIcons name="local-fire-department" size={16} color="#F97316" />
          <Text style={styles.streakText}>{goal.weeklyStreak} semanas</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <MaterialIcons name="fitness-center" size={20} color="#22C55E" />
            <Text style={styles.summaryValue}>{goal.weeklyWorkouts}</Text>
            <Text style={styles.summaryLabel}>Treinos{"\n"}esta semana</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialIcons name="trending-down" size={20} color="#3B82F6" />
            <Text style={styles.summaryValue}>
              {(goal.startWeight - goal.currentWeight).toFixed(1)}kg
            </Text>
            <Text style={styles.summaryLabel}>Peso{"\n"}perdido</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialIcons name="local-fire-department" size={20} color="#F97316" />
            <Text style={styles.summaryValue}>{goal.weeklyStreak}</Text>
            <Text style={styles.summaryLabel}>Semanas{"\n"}seguidas</Text>
          </View>
        </View>

        {/* Chart Tabs */}
        <View style={styles.chartCard}>
          <View style={styles.tabRow}>
            {(["peso", "treinos", "calorias"] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.chartTitle}>{chartData.title}</Text>

          {/* Simple Line Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {/* Y-axis labels */}
              <View style={styles.yAxis}>
                <Text style={styles.axisLabel}>{maxVal}</Text>
                <Text style={styles.axisLabel}>
                  {Math.round((minVal + maxVal) / 2)}
                </Text>
                <Text style={styles.axisLabel}>{minVal}</Text>
              </View>
              {/* Chart area */}
              <View style={[styles.chartArea, { width: CHART_WIDTH, height: CHART_HEIGHT + 20 }]}>
                {/* Grid lines */}
                {[0, 0.5, 1].map((ratio) => (
                  <View
                    key={ratio}
                    style={[
                      styles.gridLine,
                      { top: ratio * CHART_HEIGHT + 10 },
                    ]}
                  />
                ))}
                {/* Data points and lines */}
                {chartData.data.map((val, i) => {
                  const x = i * pointSpacing;
                  const y = getY(val);
                  return (
                    <View key={i}>
                      {/* Line to next point */}
                      {i < chartData.data.length - 1 && (() => {
                        const nextVal = chartData.data[i + 1];
                        const nextX = (i + 1) * pointSpacing;
                        const nextY = getY(nextVal);
                        const dx = nextX - x;
                        const dy = nextY - y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                        return (
                          <View
                            style={{
                              position: "absolute",
                              left: x,
                              top: y + 4,
                              width: length,
                              height: 2,
                              backgroundColor: chartData.color,
                              opacity: 0.7,
                              transform: [{ rotate: `${angle}deg` }],
                            }}
                          />
                        );
                      })()}
                      {/* Point */}
                      <View
                        style={[
                          styles.dataPoint,
                          {
                            left: x - 5,
                            top: y - 1,
                            backgroundColor: chartData.color,
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
            {/* X-axis labels */}
            <View style={[styles.xAxis, { marginLeft: 36 }]}>
              {PROGRESS_DATA.labels.map((label, i) => (
                <Text key={i} style={styles.xAxisLabel}>
                  {label.replace("Sem ", "S")}
                </Text>
              ))}
            </View>
          </View>

          {/* Current value highlight */}
          <View style={styles.currentValue}>
            <Text style={styles.currentValueLabel}>Atual</Text>
            <Text style={[styles.currentValueNumber, { color: chartData.color }]}>
              {chartData.data[chartData.data.length - 1]} {chartData.label}
            </Text>
            <View style={styles.trendBadge}>
              <MaterialIcons
                name={
                  chartData.data[chartData.data.length - 1] >=
                  chartData.data[chartData.data.length - 2]
                    ? "trending-up"
                    : "trending-down"
                }
                size={14}
                color={activeTab === "peso" ? "#22C55E" : "#22C55E"}
              />
              <Text style={styles.trendText}>
                {activeTab === "peso" ? "Perdendo peso" : "Melhorando"}
              </Text>
            </View>
          </View>
        </View>

        {/* Weight Goal Progress */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Meta de Peso</Text>
            <Text style={styles.goalStatus}>
              Faltam {(goal.currentWeight - goal.goalWeight).toFixed(1)} kg
            </Text>
          </View>
          <View style={styles.goalWeights}>
            <View style={styles.goalWeightItem}>
              <Text style={styles.goalWeightLabel}>Início</Text>
              <Text style={styles.goalWeightValue}>{goal.startWeight} kg</Text>
            </View>
            <View style={styles.goalWeightItem}>
              <Text style={styles.goalWeightLabel}>Atual</Text>
              <Text style={[styles.goalWeightValue, { color: "#3B82F6" }]}>
                {goal.currentWeight} kg
              </Text>
            </View>
            <View style={styles.goalWeightItem}>
              <Text style={styles.goalWeightLabel}>Meta</Text>
              <Text style={[styles.goalWeightValue, { color: "#22C55E" }]}>
                {goal.goalWeight} kg
              </Text>
            </View>
          </View>
          <View style={styles.goalBar}>
            <View
              style={[
                styles.goalBarFill,
                { width: `${Math.min(weightProgress * 100, 100)}%` as any },
              ]}
            />
          </View>
          <Text style={styles.goalPercent}>
            {Math.round(weightProgress * 100)}% concluído
          </Text>
        </View>

        {/* Weekly Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Atividade Semanal</Text>
          <View style={styles.activityBars}>
            {PROGRESS_DATA.workoutsPerWeek.map((count, i) => {
              const maxCount = Math.max(...PROGRESS_DATA.workoutsPerWeek);
              const height = (count / maxCount) * 60;
              const isLast = i === PROGRESS_DATA.workoutsPerWeek.length - 1;
              return (
                <View key={i} style={styles.activityBarContainer}>
                  <View
                    style={[
                      styles.activityBar,
                      {
                        height,
                        backgroundColor: isLast ? "#22C55E" : "#2A2A2A",
                      },
                    ]}
                  />
                  <Text style={styles.activityBarLabel}>
                    {PROGRESS_DATA.labels[i].replace("Sem ", "S")}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

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
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(249,115,22,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.3)",
  },
  streakText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F97316",
    lineHeight: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 26,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 16,
  },
  chartCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 14,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#22C55E",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    lineHeight: 18,
  },
  tabTextActive: {
    color: "#000000",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  chartContainer: {
    gap: 4,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  yAxis: {
    width: 32,
    height: CHART_HEIGHT + 20,
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: "#4B5563",
    textAlign: "right",
    lineHeight: 14,
  },
  chartArea: {
    position: "relative",
    overflow: "hidden",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#1E1E1E",
  },
  dataPoint: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#0D0D0D",
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xAxisLabel: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 14,
  },
  currentValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 12,
  },
  currentValueLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  currentValueNumber: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 11,
    color: "#22C55E",
    fontWeight: "600",
    lineHeight: 16,
  },
  goalCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  goalStatus: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    lineHeight: 18,
  },
  goalWeights: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalWeightItem: {
    alignItems: "center",
    gap: 2,
  },
  goalWeightLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  goalWeightValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  goalBar: {
    height: 8,
    backgroundColor: "#2A2A2A",
    borderRadius: 4,
    overflow: "hidden",
  },
  goalBarFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 4,
  },
  goalPercent: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 14,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  activityBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 80,
  },
  activityBarContainer: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  activityBar: {
    width: 20,
    borderRadius: 4,
    minHeight: 8,
  },
  activityBarLabel: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
  },
});
