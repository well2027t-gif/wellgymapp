import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { WORKOUTS, Exercise } from "@/lib/data";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const workout = WORKOUTS.find((w) => w.id === id) ?? WORKOUTS[0];

  const warmupExercises = workout.exercises.filter((e) => e.section === "warmup");
  const mainExercises = workout.exercises.filter((e) => e.section === "main");

  const ExerciseRow = ({ exercise }: { exercise: Exercise }) => (
    <View style={styles.exerciseRow}>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseMeta}>
          {exercise.duration ? (
            <>
              <MaterialIcons name="water-drop" size={12} color="#22C55E" />
              <Text style={styles.exerciseMetaText}>
                {exercise.duration}
                {exercise.calories ? ` • ${exercise.calories} kcal` : ""}
              </Text>
            </>
          ) : exercise.sets ? (
            <>
              <MaterialIcons name="fitness-center" size={12} color="#9CA3AF" />
              <Text style={styles.exerciseMetaText}>
                {exercise.reps
                  ? `${exercise.sets}x | ${exercise.reps}`
                  : `${exercise.sets} séries`}
              </Text>
            </>
          ) : null}
        </View>
      </View>
      <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
    </View>
  );

  return (
    <ScreenContainer
      containerClassName="bg-background"
      safeAreaClassName="bg-background"
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Treino de {workout.name}</Text>
          <Text style={styles.headerSub}>
            {workout.duration} min{"  "}|{"  "}{workout.calories} kcal
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Warmup Section */}
        {warmupExercises.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AQUECIMENTO</Text>
              <Text style={styles.sectionDuration}>5 min</Text>
            </View>
            {warmupExercises.map((ex) => (
              <ExerciseRow key={ex.id} exercise={ex} />
            ))}
          </View>
        )}

        {/* Main Exercises Section */}
        {mainExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXERCÍCIOS PRINCIPAIS</Text>
            {mainExercises.map((ex) => (
              <ExerciseRow key={ex.id} exercise={ex} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Start Button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity style={styles.startButton} activeOpacity={0.85}>
          <Text style={styles.startButtonText}>INICIAR TREINO</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 28,
  },
  headerSub: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    marginTop: 4,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.5,
    lineHeight: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionDuration: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#1E1E1E",
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 22,
  },
  exerciseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exerciseMetaText: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  exerciseImage: {
    width: 72,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E1E1E",
  },
  startButton: {
    backgroundColor: "#22C55E",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 1,
    lineHeight: 20,
  },
});
