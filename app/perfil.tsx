import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DEFAULT_GOAL } from "@/lib/data";
import { LinearGradient } from "expo-linear-gradient";

const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentário", desc: "Pouco ou nenhum exercício" },
  { key: "light", label: "Leve", desc: "Exercício 1-3 dias/semana" },
  { key: "moderate", label: "Moderado", desc: "Exercício 3-5 dias/semana" },
  { key: "active", label: "Ativo", desc: "Exercício diário intenso" },
];

const OBJECTIVES = [
  { key: "perder", label: "Emagrecer", icon: "trending-down" },
  { key: "massa", label: "Ganhar Massa", icon: "fitness-center" },
  { key: "definicao", label: "Definição", icon: "visibility" },
];

export default function PerfilScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("Atleta");
  const [photo, setPhoto] = useState<string | null>(null);
  const [currentWeight, setCurrentWeight] = useState(DEFAULT_GOAL.currentWeight.toString());
  const [goalWeight, setGoalWeight] = useState(DEFAULT_GOAL.goalWeight.toString());
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [objective, setObjective] = useState("perder");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const textPrimary = "#FFFFFF";
  const textMuted = "#9CA3AF";
  const accent = "#22C55E";
  const cardBg = "#111111";
  const borderColor = "#1A1A1A";

  const handlePickPhoto = async () => {
    if (Platform.OS === "web") {
      const demoPhotos = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80"
      ];
      setPhoto(demoPhotos[Math.floor(Math.random() * demoPhotos.length)]);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };

  const handleSave = () => {
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
  };

  return (
    <ScreenContainer containerClassName="bg-[#050505]" safeAreaClassName="bg-[#050505]">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Premium */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveHeaderBtn}>
            <Text style={styles.saveHeaderText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card de Luxo */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={handlePickPhoto} activeOpacity={0.9}>
            <LinearGradient colors={["#22C55E", "#16A34A"]} style={styles.photoGlow} />
            <View style={styles.photoInner}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={40} color="#22C55E" />
                </View>
              )}
              <View style={styles.editBadge}>
                <MaterialIcons name="camera-alt" size={14} color="#000000" />
              </View>
            </View>
          </TouchableOpacity>
          
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Seu Nome"
            placeholderTextColor={textMuted}
          />
          <Text style={styles.statusText}>Membro Premium • Nível 4</Text>
        </View>

        {/* Minha Evolução - Banner Elite */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRANSFORMAÇÃO</Text>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push("/evolucao" as any)}
            style={styles.evolutionBanner}
          >
            <LinearGradient
              colors={["rgba(34,197,94,0.2)", "rgba(5,5,5,0.8)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.evolutionGradient}
            >
              <View style={styles.evolutionInfo}>
                <View style={styles.evolutionIcon}>
                  <Ionicons name="stats-chart" size={24} color="#22C55E" />
                </View>
                <View>
                  <Text style={styles.evolutionTitle}>Diário de Evolução</Text>
                  <Text style={styles.evolutionSub}>6 fotos • Última há 2 dias</Text>
                </View>
              </View>
              <View style={styles.evolutionAction}>
                <Text style={styles.evolutionActionText}>VER TUDO</Text>
                <Ionicons name="arrow-forward" size={16} color="#22C55E" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Métricas Físicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MÉTRICAS ATUAIS</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>PESO ATUAL</Text>
              <View style={styles.metricInputRow}>
                <TextInput
                  style={styles.metricInput}
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  keyboardType="numeric"
                />
                <Text style={styles.metricUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>PESO META</Text>
              <View style={styles.metricInputRow}>
                <TextInput
                  style={styles.metricInput}
                  value={goalWeight}
                  onChangeText={setGoalWeight}
                  keyboardType="numeric"
                />
                <Text style={[styles.metricUnit, { color: "#22C55E" }]}>kg</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Objetivos Glassmorphism */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBJETIVO</Text>
          <View style={styles.objectivesGrid}>
            {OBJECTIVES.map((obj) => (
              <TouchableOpacity
                key={obj.key}
                onPress={() => setObjective(obj.key)}
                style={[
                  styles.objectiveCard,
                  objective === obj.key && styles.objectiveCardActive
                ]}
              >
                <MaterialIcons 
                  name={obj.icon as any} 
                  size={24} 
                  color={objective === obj.key ? "#000000" : "#22C55E"} 
                />
                <Text style={[
                  styles.objectiveText,
                  objective === obj.key && styles.objectiveTextActive
                ]}>
                  {obj.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={20} color="#D1D5DB" />
                <Text style={styles.settingLabel}>Notificações</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#1A1A1A", true: "#22C55E" }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon-outline" size={20} color="#D1D5DB" />
                <Text style={styles.settingLabel}>Modo Escuro</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={(val) => setColorScheme(val ? "dark" : "light")}
                trackColor={{ false: "#1A1A1A", true: "#22C55E" }}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  saveHeaderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.1)",
  },
  saveHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22C55E",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  photoContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  photoGlow: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    opacity: 0.3,
  },
  photoInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#111111",
    borderWidth: 3,
    borderColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#050505",
  },
  nameInput: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    textAlign: "center",
  },
  statusText: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#6B7280",
    letterSpacing: 2,
    marginBottom: 16,
  },
  evolutionBanner: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.1)",
  },
  evolutionGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  evolutionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  evolutionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  evolutionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  evolutionSub: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  evolutionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  evolutionActionText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#22C55E",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 8,
  },
  metricInputRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  metricInput: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    padding: 0,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  objectivesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  objectiveCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  objectiveCardActive: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  objectiveText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D1D5DB",
    textAlign: "center",
  },
  objectiveTextActive: {
    color: "#000000",
  },
  settingsCard: {
    backgroundColor: "#111111",
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
  },
  logoutBtn: {
    marginTop: 20,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#EF4444",
  },
});
