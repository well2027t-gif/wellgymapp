import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { DEFAULT_GOAL, Goal } from "@/lib/data";

const OBJECTIVES = [
  { id: "massa", label: "Ganhar Massa", icon: "fitness-center" as const, color: "#22C55E" },
  { id: "perder", label: "Perder Peso", icon: "trending-down" as const, color: "#3B82F6" },
  { id: "definicao", label: "Definição", icon: "star" as const, color: "#F59E0B" },
  { id: "manutencao", label: "Manutenção", icon: "balance" as const, color: "#A855F7" },
  { id: "saude", label: "Saúde Geral", icon: "favorite" as const, color: "#EF4444" },
  { id: "performance", label: "Performance", icon: "bolt" as const, color: "#F97316" },
];

export default function MetaScreen() {
  const [goal, setGoal] = useState<Goal>(DEFAULT_GOAL);
  const [selectedObjective, setSelectedObjective] = useState("perder");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "Atleta",
    age: "28",
    height: "178",
    weight: goal.currentWeight.toString(),
    goalWeight: goal.goalWeight.toString(),
    weeklyWorkouts: goal.goalWeeklyWorkouts.toString(),
    dailyCalories: goal.goalDailyCalories.toString(),
  });

  const weightProgress = Math.max(
    0,
    Math.min(
      (goal.startWeight - goal.currentWeight) /
        (goal.startWeight - goal.goalWeight),
      1
    )
  );

  const handleSave = () => {
    setGoal((prev) => ({
      ...prev,
      currentWeight: parseFloat(form.weight) || prev.currentWeight,
      goalWeight: parseFloat(form.goalWeight) || prev.goalWeight,
      goalWeeklyWorkouts: parseInt(form.weeklyWorkouts) || prev.goalWeeklyWorkouts,
      goalDailyCalories: parseInt(form.dailyCalories) || prev.goalDailyCalories,
    }));
    setEditing(false);
    if (Platform.OS !== "web") {
      Alert.alert("Salvo!", "Suas metas foram atualizadas.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Metas</Text>
        <TouchableOpacity
          style={[styles.editButton, editing && styles.editButtonActive]}
          activeOpacity={0.7}
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <MaterialIcons
            name={editing ? "check" : "edit"}
            size={18}
            color={editing ? "#000000" : "#22C55E"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <MaterialIcons name="person" size={36} color="#22C55E" />
          </View>
          <View style={styles.profileInfo}>
            {editing ? (
              <TextInput
                style={styles.inputName}
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholderTextColor="#6B7280"
              />
            ) : (
              <Text style={styles.profileName}>{form.name}</Text>
            )}
            <Text style={styles.profileSub}>
              {form.age} anos • {form.height} cm
            </Text>
          </View>
        </View>

        {/* Objective */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>OBJETIVO</Text>
          <View style={styles.objectivesGrid}>
            {OBJECTIVES.map((obj) => {
              const isActive = selectedObjective === obj.id;
              return (
                <TouchableOpacity
                  key={obj.id}
                  style={[
                    styles.objectiveItem,
                    isActive && { borderColor: obj.color, backgroundColor: `${obj.color}18` },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedObjective(obj.id)}
                >
                  <MaterialIcons
                    name={obj.icon}
                    size={20}
                    color={isActive ? obj.color : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.objectiveLabel,
                      isActive && { color: obj.color },
                    ]}
                  >
                    {obj.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Weight Goal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>META DE PESO</Text>
          <View style={styles.weightRow}>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Peso Atual</Text>
              {editing ? (
                <TextInput
                  style={styles.inputWeight}
                  value={form.weight}
                  onChangeText={(v) => setForm((f) => ({ ...f, weight: v }))}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#6B7280"
                />
              ) : (
                <Text style={styles.weightValue}>{goal.currentWeight} kg</Text>
              )}
            </View>
            <View style={styles.weightArrow}>
              <MaterialIcons name="arrow-forward" size={20} color="#6B7280" />
            </View>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Meta</Text>
              {editing ? (
                <TextInput
                  style={[styles.inputWeight, { color: "#22C55E" }]}
                  value={form.goalWeight}
                  onChangeText={(v) => setForm((f) => ({ ...f, goalWeight: v }))}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#6B7280"
                />
              ) : (
                <Text style={[styles.weightValue, { color: "#22C55E" }]}>
                  {goal.goalWeight} kg
                </Text>
              )}
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${weightProgress * 100}%` as any },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>
              {goal.startWeight} kg (início)
            </Text>
            <Text style={styles.progressLabelText}>
              {Math.round(weightProgress * 100)}% concluído
            </Text>
          </View>
          <View style={styles.remainingBadge}>
            <MaterialIcons name="flag" size={14} color="#22C55E" />
            <Text style={styles.remainingText}>
              Faltam {(goal.currentWeight - goal.goalWeight).toFixed(1)} kg para a meta
            </Text>
          </View>
        </View>

        {/* Training Goal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>META DE TREINOS</Text>
          <View style={styles.trainingGoalRow}>
            <View style={styles.trainingGoalLeft}>
              <MaterialIcons name="fitness-center" size={24} color="#22C55E" />
              <View>
                <Text style={styles.trainingGoalLabel}>Treinos por semana</Text>
                {editing ? (
                  <TextInput
                    style={styles.inputTraining}
                    value={form.weeklyWorkouts}
                    onChangeText={(v) => setForm((f) => ({ ...f, weeklyWorkouts: v }))}
                    keyboardType="number-pad"
                    placeholderTextColor="#6B7280"
                  />
                ) : (
                  <Text style={styles.trainingGoalValue}>
                    {goal.weeklyWorkouts}/{goal.goalWeeklyWorkouts} treinos
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.trainingDots}>
              {Array.from({ length: goal.goalWeeklyWorkouts }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.trainingDot,
                    i < goal.weeklyWorkouts && styles.trainingDotDone,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Calorie Goal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>META DE CALORIAS</Text>
          <View style={styles.calorieRow}>
            <View style={styles.calorieLeft}>
              <MaterialIcons name="local-fire-department" size={24} color="#F97316" />
              <View>
                <Text style={styles.calorieLabel}>Calorias diárias</Text>
                {editing ? (
                  <TextInput
                    style={styles.inputTraining}
                    value={form.dailyCalories}
                    onChangeText={(v) => setForm((f) => ({ ...f, dailyCalories: v }))}
                    keyboardType="number-pad"
                    placeholderTextColor="#6B7280"
                  />
                ) : (
                  <Text style={styles.calorieValue}>
                    {goal.dailyCalories} / {goal.goalDailyCalories} kcal
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFillOrange,
                {
                  width: `${Math.min(
                    (goal.dailyCalories / goal.goalDailyCalories) * 100,
                    100
                  )}%` as any,
                },
              ]}
            />
          </View>
        </View>

        {/* Personal Data */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
          <View style={styles.dataGrid}>
            <DataField
              label="Idade"
              value={form.age}
              unit="anos"
              editing={editing}
              onChange={(v) => setForm((f) => ({ ...f, age: v }))}
            />
            <DataField
              label="Altura"
              value={form.height}
              unit="cm"
              editing={editing}
              onChange={(v) => setForm((f) => ({ ...f, height: v }))}
            />
          </View>
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>SALVAR METAS</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function DataField({
  label,
  value,
  unit,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  unit: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <View style={dataStyles.container}>
      <Text style={dataStyles.label}>{label}</Text>
      {editing ? (
        <View style={dataStyles.inputRow}>
          <TextInput
            style={dataStyles.input}
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            placeholderTextColor="#6B7280"
          />
          <Text style={dataStyles.unit}>{unit}</Text>
        </View>
      ) : (
        <Text style={dataStyles.value}>
          {value} <Text style={dataStyles.unit}>{unit}</Text>
        </Text>
      )}
    </View>
  );
}

const dataStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  input: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 26,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#22C55E",
    paddingBottom: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 26,
  },
  unit: {
    fontSize: 12,
    color: "#9CA3AF",
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
  editButtonActive: {
    backgroundColor: "#22C55E",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 2,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 26,
  },
  profileSub: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  inputName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#22C55E",
    paddingBottom: 2,
    lineHeight: 26,
  },
  sectionCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  objectivesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    backgroundColor: "#0D0D0D",
  },
  objectiveLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    lineHeight: 16,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  weightArrow: {
    paddingTop: 16,
  },
  weightLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  weightValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 30,
  },
  inputWeight: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#22C55E",
    paddingBottom: 2,
    lineHeight: 30,
    width: "100%",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#2A2A2A",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 4,
  },
  progressFillOrange: {
    height: "100%",
    backgroundColor: "#F97316",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  remainingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  remainingText: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    lineHeight: 18,
  },
  trainingGoalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trainingGoalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trainingGoalLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  trainingGoalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  inputTraining: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#22C55E",
    paddingBottom: 2,
    lineHeight: 22,
    minWidth: 40,
  },
  trainingDots: {
    flexDirection: "row",
    gap: 6,
  },
  trainingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2A2A2A",
    borderWidth: 1.5,
    borderColor: "#374151",
  },
  trainingDotDone: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  calorieRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calorieLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  calorieLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  dataGrid: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#22C55E",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 1,
    lineHeight: 20,
  },
});
