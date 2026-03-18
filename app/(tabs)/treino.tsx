import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { WORKOUTS, WEEK_DAYS } from "@/lib/data";

export default function TreinoScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0);

  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const getDateForDay = (index: number) => {
    const d = new Date();
    const diff = index - dayIndex;
    d.setDate(d.getDate() + diff);
    return d.getDate();
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meus Treinos</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          activeOpacity={0.7}
          onPress={() => router.push("/create-workout" as Href)}
        >
          <MaterialIcons name="add" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Week Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekScroll}
        style={styles.weekScrollContainer}
      >
        {WEEK_DAYS.map((day, index) => {
          const isActive = index === selectedDay;
          const isToday = index === dayIndex;
          const date = getDateForDay(index);
          const workout = WORKOUTS.find((w) => w.dayLabel === day);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, isActive && styles.dayChipActive]}
              activeOpacity={0.7}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[styles.dayChipLabel, isActive && styles.dayChipLabelActive]}>
                {day}
              </Text>
              <Text style={[styles.dayChipDate, isActive && styles.dayChipDateActive]}>
                {date}
              </Text>
              {workout && (
                <View style={[styles.dayChipDot, isActive && styles.dayChipDotActive]} />
              )}
              {isToday && !isActive && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Workouts for selected day */}
        {(() => {
          const dayLabel = WEEK_DAYS[selectedDay];
          const workout = WORKOUTS.find((w) => w.dayLabel === dayLabel);
          if (!workout) {
            return (
              <View style={styles.restDay}>
                <MaterialIcons name="self-improvement" size={48} color="#374151" />
                <Text style={styles.restDayTitle}>Dia de Descanso</Text>
                <Text style={styles.restDayText}>
                  Aproveite para recuperar e preparar o corpo para o próximo treino.
                </Text>
              </View>
            );
          }
          return (
            <TouchableOpacity
              style={styles.workoutCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/workout/${workout.id}` as Href)}
            >
              <View style={styles.workoutCardTop}>
                <View style={styles.workoutCardLeft}>
                  <View style={styles.workoutIconBg}>
                    <MaterialIcons name="fitness-center" size={22} color="#22C55E" />
                  </View>
                  <View>
                    <Text style={styles.workoutCardName}>{workout.name}</Text>
                    <View style={styles.workoutCardMeta}>
                      <MaterialIcons name="access-time" size={12} color="#9CA3AF" />
                      <Text style={styles.workoutCardMetaText}>{workout.duration} min</Text>
                      <MaterialIcons name="local-fire-department" size={12} color="#F97316" />
                      <Text style={styles.workoutCardMetaText}>{workout.calories} kcal</Text>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#6B7280" />
              </View>
              <View style={styles.workoutCardDivider} />
              <View style={styles.exerciseList}>
                {workout.exercises.slice(0, 4).map((ex) => (
                  <View key={ex.id} style={styles.exerciseItem}>
                    <View style={styles.exerciseDot} />
                    <Text style={styles.exerciseItemText}>{ex.name}</Text>
                    {ex.sets && (
                      <Text style={styles.exerciseItemMeta}>
                        {ex.reps ? `${ex.sets}x ${ex.reps}` : `${ex.sets} séries`}
                      </Text>
                    )}
                  </View>
                ))}
                {workout.exercises.length > 4 && (
                  <Text style={styles.moreExercises}>
                    +{workout.exercises.length - 4} exercícios
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.startButton}
                activeOpacity={0.85}
                onPress={() => router.push(`/workout/${workout.id}` as Href)}
              >
                <Text style={styles.startButtonText}>VER TREINO COMPLETO</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })()}

        {/* All Workouts */}
        <Text style={styles.sectionTitle}>TODOS OS TREINOS</Text>
        {WORKOUTS.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutListItem}
            activeOpacity={0.7}
            onPress={() => router.push(`/workout/${workout.id}` as Href)}
          >
            <View style={styles.workoutListLeft}>
              <View style={styles.workoutListDayBadge}>
                <Text style={styles.workoutListDayText}>{workout.dayLabel}</Text>
              </View>
              <View>
                <Text style={styles.workoutListName}>{workout.name}</Text>
                <Text style={styles.workoutListMeta}>
                  {workout.duration} min • {workout.exercises.length} exercícios
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#6B7280" />
          </TouchableOpacity>
        ))}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  weekScrollContainer: {
    maxHeight: 80,
    marginBottom: 16,
  },
  weekScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayChip: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 2,
    minWidth: 52,
  },
  dayChipActive: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  dayChipLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    lineHeight: 16,
  },
  dayChipLabelActive: {
    color: "#000000",
  },
  dayChipDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  dayChipDateActive: {
    color: "#000000",
  },
  dayChipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginTop: 2,
  },
  dayChipDotActive: {
    backgroundColor: "#000000",
  },
  todayIndicator: {
    position: "absolute",
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#22C55E",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  restDay: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  restDayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
    lineHeight: 24,
  },
  restDayText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  workoutCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 12,
  },
  workoutCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workoutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  workoutCardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  workoutCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  workoutCardMetaText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 6,
    lineHeight: 16,
  },
  workoutCardDivider: {
    height: 1,
    backgroundColor: "#2A2A2A",
  },
  exerciseList: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  exerciseItemText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  exerciseItemMeta: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  moreExercises: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 14,
    lineHeight: 16,
  },
  startButton: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  startButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22C55E",
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.5,
    marginTop: 8,
    lineHeight: 16,
  },
  workoutListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  workoutListLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workoutListDayBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  workoutListDayText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#22C55E",
    lineHeight: 16,
  },
  workoutListName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  workoutListMeta: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    lineHeight: 16,
  },
});
