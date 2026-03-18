import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { CircularProgress } from "@/components/circular-progress";
import { WORKOUTS, WEEK_DAYS, STATS, DEFAULT_GOAL, type Goal } from "@/lib/data";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const GYM_BG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80";

export default function HomeScreen() {
  const router = useRouter();
  const todayWorkout = WORKOUTS[0];
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const goal: Goal = DEFAULT_GOAL;

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const weightProgress = Math.max(
    0,
    Math.min((goal.startWeight - goal.currentWeight) / (goal.startWeight - goal.goalWeight), 1)
  );

  return (
    <ScreenContainer containerClassName="bg-[#050505]" safeAreaClassName="bg-[#050505]">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Premium */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>BOM DIA,</Text>
            <Text style={styles.userName}>Atleta <Text style={styles.userDot}>•</Text></Text>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push("/perfil" as Href)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#22C55E", "#16A34A"]} style={styles.avatarGlow} />
            <View style={styles.avatarInner}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImg} />
              ) : (
                <Ionicons name="person" size={20} color="#22C55E" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Workout Card - Design Elite */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/workout/${todayWorkout.id}` as Href)}
          style={styles.workoutCard}
        >
          <ImageBackground source={{ uri: GYM_BG }} style={styles.workoutBg} imageStyle={styles.workoutBgImage}>
            <LinearGradient
              colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.95)"]}
              style={styles.workoutOverlay}
            >
              <View style={styles.workoutHeader}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>HOJE</Text>
                </View>
                <Text style={styles.workoutDuration}>{todayWorkout.duration} min</Text>
              </View>
              
              <View style={styles.workoutMain}>
                <Text style={styles.workoutName}>{todayWorkout.name.toUpperCase()}</Text>
                <View style={styles.workoutMeta}>
                  <View style={styles.metaItem}>
                    <FontAwesome5 name="fire-alt" size={14} color="#F97316" />
                    <Text style={styles.metaText}>{todayWorkout.calories} kcal</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Ionicons name="fitness-outline" size={16} color="#22C55E" />
                    <Text style={styles.metaText}>6 exercícios</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                activeOpacity={0.85}
                onPress={() => router.push(`/workout/${todayWorkout.id}` as Href)}
              >
                <LinearGradient colors={["#22C55E", "#16A34A"]} style={styles.startGradient}>
                  <Text style={styles.startButtonText}>INICIAR TREINO</Text>
                  <Ionicons name="play-circle" size={20} color="#000000" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* Week Days - Minimalist */}
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day, index) => {
            const isToday = index === dayIndex;
            return (
              <View key={day} style={styles.dayContainer}>
                <Text style={[styles.dayText, isToday && styles.dayTextActive]}>{day}</Text>
                <View style={[styles.dayDot, isToday && styles.dayDotActive]} />
              </View>
            );
          })}
        </View>

        {/* Stats Grid - Glassmorphism */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <CircularProgress value={STATS.caloriesToday} maxValue={800} size={80} strokeWidth={6} color="#22C55E" label="" />
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{STATS.caloriesToday}</Text>
                <Text style={styles.statLabel}>KCAL</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <CircularProgress value={STATS.minutesToday} maxValue={90} size={80} strokeWidth={6} color="#3B82F6" label="" />
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{STATS.minutesToday}</Text>
                <Text style={styles.statLabel}>MIN</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Card - Luxury Style */}
        <TouchableOpacity 
          style={styles.profileCard} 
          activeOpacity={0.9}
          onPress={() => router.push("/perfil" as Href)}
        >
          <LinearGradient colors={["#111111", "#080808"]} style={styles.profileGradient}>
            <View style={styles.profileHeader}>
              <View style={styles.profilePhotoBox}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80" }} style={styles.profilePhoto} />
              </View>
              <View style={styles.profileMainInfo}>
                <Text style={styles.profileName}>Atleta</Text>
                <View style={styles.profileBadge}>
                  <Text style={styles.profileBadgeText}>EMAGRECIMENTO</Text>
                </View>
              </View>
              <View style={styles.weightBox}>
                <Text style={styles.weightValue}>{goal.currentWeight}</Text>
                <Text style={styles.weightLabel}>KG</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progresso da Meta</Text>
                <Text style={styles.progressPercent}>{Math.round(weightProgress * 100)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={["#22C55E", "#16A34A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${Math.round(weightProgress * 100)}%` as any }]}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    marginTop: 10,
  },
  greeting: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 2,
  },
  userName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  userDot: {
    color: "#22C55E",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlow: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    opacity: 0.2,
  },
  avatarInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111111",
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  workoutCard: {
    height: 440,
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  workoutBg: { flex: 1 },
  workoutBgImage: { opacity: 0.8 },
  workoutOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  workoutDuration: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  workoutMain: {
    marginBottom: 20,
  },
  workoutName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 44,
    letterSpacing: -1.5,
  },
  workoutMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D1D5DB",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  startButton: {
    height: 64,
    borderRadius: 20,
    overflow: "hidden",
  },
  startGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: 1,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  dayContainer: {
    alignItems: "center",
    gap: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4B5563",
  },
  dayTextActive: {
    color: "#FFFFFF",
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "transparent",
  },
  dayDotActive: {
    backgroundColor: "#22C55E",
    width: 12,
    height: 4,
    borderRadius: 2,
  },
  statsGrid: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    height: 120,
    backgroundColor: "#111111",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  statInfo: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 1,
  },
  profileCard: {
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  profileGradient: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profilePhotoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  profilePhoto: { width: "100%", height: "100%" },
  profileMainInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  profileBadge: {
    backgroundColor: "rgba(34,197,94,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  profileBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#22C55E",
  },
  weightBox: {
    alignItems: "center",
  },
  weightValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  weightLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
  },
  progressContainer: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D1D5DB",
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "900",
    color: "#22C55E",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
