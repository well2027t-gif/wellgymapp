import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { CircularProgress } from "@/components/circular-progress";
import { WORKOUTS, WEEK_DAYS, STATS, DEFAULT_GOAL, type Goal } from "@/lib/data";

const GYM_BG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=60";
const MOTIVATION_BG = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=60";

const OBJECTIVES_LABEL: Record<string, string> = {
  perder: "Emagrecimento",
  massa: "Ganhar Massa",
  definicao: "Definição",
  manutencao: "Manutenção",
  saude: "Saúde Geral",
  performance: "Performance",
};

export default function HomeScreen() {
  const router = useRouter();
  const todayWorkout = WORKOUTS[0];
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const goal: Goal & { objective?: string } = DEFAULT_GOAL;

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const weightProgress = Math.max(
    0,
    Math.min(
      (goal.startWeight - goal.currentWeight) /
        (goal.startWeight - goal.goalWeight),
      1
    )
  );

  const handlePickPhoto = async () => {
    if (Platform.OS === "web") return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bom dia 👋</Text>
            <Text style={styles.userName}>Atleta</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push("/perfil" as Href)}
            activeOpacity={0.8}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImg} />
            ) : (
              <MaterialIcons name="person" size={24} color="#22C55E" />
            )}
          </TouchableOpacity>
        </View>

        {/* Today's Workout Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/workout/${todayWorkout.id}` as Href)}
          style={styles.workoutCard}
        >
          <ImageBackground
            source={{ uri: GYM_BG }}
            style={styles.workoutBg}
            imageStyle={styles.workoutBgImage}
            transition={200}
            cachePolicy="memory-disk"
          >
            <View style={styles.workoutOverlay}>
              <Text style={styles.todayLabel}>TREINO DE HOJE</Text>
              <Text style={styles.workoutName}>{todayWorkout.name}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <MaterialIcons name="access-time" size={14} color="#9CA3AF" />
                  <Text style={styles.metaText}>{todayWorkout.duration} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="local-fire-department" size={14} color="#F97316" />
                  <Text style={styles.metaText}>{todayWorkout.calories} kcal</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                activeOpacity={0.85}
                onPress={() => router.push(`/workout/${todayWorkout.id}` as Href)}
              >
                <Text style={styles.startButtonText}>COMEÇAR TREINO</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Week Days */}
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day, index) => {
            const workout = WORKOUTS.find((w) => w.dayLabel === day);
            const isToday = index === dayIndex;
            const hasWorkout = !!workout;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayItem, isToday && styles.dayItemActive]}
                activeOpacity={0.7}
                onPress={() => workout && router.push(`/workout/${workout.id}` as Href)}
              >
                <Text style={[styles.dayText, isToday && styles.dayTextActive]}>{day}</Text>
                <View
                  style={[
                    styles.dayDot,
                    hasWorkout ? styles.dayDotActive : styles.dayDotEmpty,
                    isToday && styles.dayDotToday,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Stats Circles */}
        <View style={styles.statsCard}>
          <CircularProgress
            value={STATS.caloriesToday}
            maxValue={800}
            size={104}
            strokeWidth={8}
            color="#22C55E"
            label="Calorias"
          />
          <CircularProgress
            value={STATS.minutesToday}
            maxValue={90}
            size={104}
            strokeWidth={8}
            color="#3B82F6"
            label="Tempo"
            unit="m"
          />
          <CircularProgress
            value={STATS.workoutsThisWeek}
            maxValue={STATS.totalWorkouts}
            size={104}
            strokeWidth={8}
            color="#A855F7"
            label="Treinos"
          />
        </View>

        {/* Motivation Card */}
        <View style={styles.motivationCard}>
          <ImageBackground
            source={{ uri: MOTIVATION_BG }}
            style={styles.motivationBg}
            imageStyle={styles.motivationBgImage}
            transition={200}
            cachePolicy="memory-disk"
          >
            <View style={styles.motivationOverlay}>
              <View style={styles.motivationRow}>
                <MaterialIcons name="local-fire-department" size={28} color="#F97316" />
                <Text style={styles.motivationText}>
                  Você está melhor que{" "}
                  <Text style={styles.motivationPercent}>{STATS.betterThanPercent}%</Text>
                </Text>
              </View>
              <Text style={styles.motivationSub}>
                + {STATS.weeklyImprovement}% esta semana
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Left: Photo */}
          <TouchableOpacity
            style={styles.profilePhotoContainer}
            onPress={() => router.push("/perfil" as Href)}
            activeOpacity={0.8}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <MaterialIcons name="add-a-photo" size={28} color="#22C55E" />
                <Text style={styles.profilePhotoHint}>Adicionar{"\n"}foto</Text>
              </View>
            )}
            {/* Progress ring overlay */}
            <View style={styles.profilePhotoRing} />
          </TouchableOpacity>

          {/* Right: Stats */}
          <View style={styles.profileStats}>
            {/* Name & goal */}
            <View style={styles.profileNameRow}>
              <Text style={styles.profileName}>Atleta</Text>
              <View style={styles.goalBadge}>
                <MaterialIcons name="flag" size={11} color="#22C55E" />
                <Text style={styles.goalBadgeText}>
                  {OBJECTIVES_LABEL[(goal as any).objective ?? 'perder'] ?? "Emagrecimento"}
                </Text>
              </View>
            </View>

            {/* Weight row */}
            <View style={styles.weightRow}>
              <View style={styles.weightItem}>
                <Text style={styles.weightValue}>{goal.currentWeight}</Text>
                <Text style={styles.weightUnit}>kg atual</Text>
              </View>
              <View style={styles.weightDivider} />
              <View style={styles.weightItem}>
                <Text style={[styles.weightValue, { color: "#22C55E" }]}>{goal.goalWeight}</Text>
                <Text style={styles.weightUnit}>kg meta</Text>
              </View>
              <View style={styles.weightDivider} />
              <View style={styles.weightItem}>
                <Text style={[styles.weightValue, { color: "#3B82F6" }]}>
                  {(goal.startWeight - goal.currentWeight).toFixed(1)}
                </Text>
                <Text style={styles.weightUnit}>kg perdidos</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progresso da meta</Text>
                <Text style={styles.progressPercent}>
                  {Math.round(weightProgress * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(weightProgress * 100)}%` as any },
                  ]}
                />
              </View>
              <Text style={styles.progressSub}>
                Faltam {(goal.currentWeight - goal.goalWeight).toFixed(1)} kg para a meta
              </Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </ScreenContainer>
  );
}



const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 28,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A1A1A",
    borderWidth: 1.5,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  workoutCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  workoutBg: {
    width: "100%",
    minHeight: 220,
  },
  workoutBgImage: {
    borderRadius: 20,
  },
  workoutOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 20,
    paddingBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#22C55E",
    letterSpacing: 1.5,
    marginBottom: 6,
    lineHeight: 16,
  },
  workoutName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
    lineHeight: 32,
  },
  workoutMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: "#22C55E",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 1,
    lineHeight: 20,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  dayItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    gap: 6,
  },
  dayItemActive: {
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  dayText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    lineHeight: 16,
  },
  dayTextActive: {
    color: "#22C55E",
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayDotActive: {
    backgroundColor: "#22C55E",
  },
  dayDotEmpty: {
    backgroundColor: "#374151",
  },
  dayDotToday: {
    backgroundColor: "#22C55E",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  motivationCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  motivationBg: {
    width: "100%",
  },
  motivationBgImage: {
    borderRadius: 20,
    opacity: 0.4,
  },
  motivationOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  motivationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  motivationPercent: {
    color: "#22C55E",
    fontWeight: "800",
  },
  motivationSub: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    marginLeft: 38,
    lineHeight: 18,
  },

  // ─── Profile Card ───────────────────────────────────────────────
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "flex-start",
  },
  profilePhotoContainer: {
    position: "relative",
    width: 120,
    height: 130,
  },
  profilePhoto: {
    width: 120,
    height: 130,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#22C55E",
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 130,
    borderRadius: 18,
    backgroundColor: "#0D0D0D",
    borderWidth: 2,
    borderColor: "#2A2A2A",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  profilePhotoHint: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 14,
  },
  profilePhotoRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(34,197,94,0.2)",
  },
  profileStats: {
    flex: 1,
    gap: 10,
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
  },
  goalBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#22C55E",
    lineHeight: 14,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weightItem: {
    flex: 1,
    alignItems: "center",
    gap: 1,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  weightUnit: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
    textAlign: "center",
  },
  weightDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#2A2A2A",
  },
  progressSection: {
    gap: 5,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  progressPercent: {
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
  progressSub: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
  },


});
