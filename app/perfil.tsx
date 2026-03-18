import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScreenContainer } from "@/components/screen-container";
import { useThemeContext } from "@/lib/theme-provider";
import { DEFAULT_GOAL } from "@/lib/data";

const OBJECTIVES = [
  { key: "perder", label: "Emagrecimento", icon: "trending-down" },
  { key: "massa", label: "Ganhar Massa", icon: "fitness-center" },
  { key: "definicao", label: "Definição", icon: "star" },
  { key: "manutencao", label: "Manutenção", icon: "balance" },
  { key: "saude", label: "Saúde Geral", icon: "favorite" },
  { key: "performance", label: "Performance", icon: "speed" },
];

const ACTIVITY_LEVELS = [
  { key: "sedentario", label: "Sedentário", desc: "Pouco ou nenhum exercício" },
  { key: "leve", label: "Levemente ativo", desc: "1-3 dias/semana" },
  { key: "moderado", label: "Moderadamente ativo", desc: "3-5 dias/semana" },
  { key: "intenso", label: "Muito ativo", desc: "6-7 dias/semana" },
  { key: "atleta", label: "Atleta", desc: "2x por dia" },
];

export default function PerfilScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("Atleta");
  const [editingName, setEditingName] = useState(false);
  const [age, setAge] = useState("28");
  const [height, setHeight] = useState("175");
  const [currentWeight, setCurrentWeight] = useState(String(DEFAULT_GOAL.currentWeight));
  const [goalWeight, setGoalWeight] = useState(String(DEFAULT_GOAL.goalWeight));
  const [objective, setObjective] = useState("perder");
  const [activityLevel, setActivityLevel] = useState("moderado");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Derived colors based on current theme
  const bg = isDark ? "#0D0D0D" : "#F5F5F5";
  const cardBg = isDark ? "#1A1A1A" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textMuted = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#2A2A2A" : "#E5E7EB";
  const accent = isDark ? "#22C55E" : "#16A34A";

  const handlePickPhoto = async () => {
    if (Platform.OS === "web") {
      // No web, vamos simular o seletor de arquivos ou usar uma imagem padrão para demonstração
      const demoPhotos = [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
      ];
      const randomPhoto = demoPhotos[Math.floor(Math.random() * demoPhotos.length)];
      setPhoto(randomPhoto);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para alterar sua foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    Alert.alert("Perfil salvo!", "Suas informações foram atualizadas com sucesso.");
  };

  const imc =
    height && currentWeight
      ? (Number(currentWeight) / Math.pow(Number(height) / 100, 2)).toFixed(1)
      : "--";

  const imcLabel = () => {
    const v = Number(imc);
    if (isNaN(v)) return "";
    if (v < 18.5) return "Abaixo do peso";
    if (v < 25) return "Peso normal";
    if (v < 30) return "Sobrepeso";
    return "Obesidade";
  };

  const imcColor = () => {
    const v = Number(imc);
    if (isNaN(v)) return textMuted;
    if (v < 18.5) return "#3B82F6";
    if (v < 25) return accent;
    if (v < 30) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <ScreenContainer
      containerClassName={isDark ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]"}
      safeAreaClassName={isDark ? "bg-[#0D0D0D]" : "bg-[#F5F5F5]"}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: cardBg, borderColor }]} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={24} color={textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Meu Perfil</Text>
          <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { borderColor: accent }]} activeOpacity={0.8}>
            <Text style={[styles.saveBtnText, { color: accent }]}>Salvar</Text>
          </TouchableOpacity>
        </View>

        {/* Photo + Name */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.85} style={styles.photoWrapper}>
            {photo ? (
              <Image source={{ uri: photo }} style={[styles.photo, { borderColor: accent }]} />
            ) : (
              <View style={[styles.photoPlaceholder, { backgroundColor: cardBg, borderColor }]}>
                <MaterialIcons name="person" size={52} color={textMuted} />
              </View>
            )}
            <View style={[styles.photoBadge, { backgroundColor: accent }]}>
              <MaterialIcons name="camera-alt" size={16} color="#000" />
            </View>
          </TouchableOpacity>

          {editingName ? (
            <TextInput
              style={[styles.nameInput, { color: textPrimary, borderBottomColor: accent }]}
              value={name}
              onChangeText={setName}
              autoFocus
              onBlur={() => setEditingName(false)}
              onSubmitEditing={() => setEditingName(false)}
              returnKeyType="done"
              maxLength={30}
              placeholderTextColor={textMuted}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)} activeOpacity={0.7} style={styles.nameRow}>
              <Text style={[styles.nameText, { color: textPrimary }]}>{name}</Text>
              <MaterialIcons name="edit" size={16} color={accent} />
            </TouchableOpacity>
          )}
          <Text style={[styles.memberSince, { color: textMuted }]}>Membro desde Jan 2025</Text>
        </View>

        {/* IMC Card */}
        <View style={[styles.imcCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.imcItem}>
            <Text style={[styles.imcValue, { color: textPrimary }]}>{currentWeight} kg</Text>
            <Text style={[styles.imcLabel, { color: textMuted }]}>Peso atual</Text>
          </View>
          <View style={[styles.imcDivider, { backgroundColor: borderColor }]} />
          <View style={styles.imcItem}>
            <Text style={[styles.imcValue, { color: imcColor() }]}>{imc}</Text>
            <Text style={[styles.imcLabel, { color: textMuted }]}>IMC</Text>
          </View>
          <View style={[styles.imcDivider, { backgroundColor: borderColor }]} />
          <View style={styles.imcItem}>
            <Text style={[styles.imcValue, { color: imcColor(), fontSize: 13 }]}>{imcLabel()}</Text>
            <Text style={[styles.imcLabel, { color: textMuted }]}>Classificação</Text>
          </View>
        </View>

        {/* Dados Pessoais */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>Dados Pessoais</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.inputRow}>
              <MaterialIcons name="person" size={20} color={accent} />
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Nome completo</Text>
                <TextInput
                  style={[styles.inputField, { color: textPrimary }]}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={textMuted}
                  returnKeyType="done"
                />
              </View>
            </View>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <View style={styles.inputRow}>
              <MaterialIcons name="cake" size={20} color={accent} />
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Idade</Text>
                <TextInput
                  style={[styles.inputField, { color: textPrimary }]}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholderTextColor={textMuted}
                  returnKeyType="done"
                  maxLength={3}
                />
              </View>
            </View>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <View style={styles.inputRow}>
              <MaterialIcons name="height" size={20} color={accent} />
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Altura (cm)</Text>
                <TextInput
                  style={[styles.inputField, { color: textPrimary }]}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  placeholderTextColor={textMuted}
                  returnKeyType="done"
                  maxLength={3}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Metas de Peso */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>Metas de Peso</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.inputRow}>
              <MaterialIcons name="monitor-weight" size={20} color="#3B82F6" />
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Peso atual (kg)</Text>
                <TextInput
                  style={[styles.inputField, { color: textPrimary }]}
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  keyboardType="decimal-pad"
                  placeholderTextColor={textMuted}
                  returnKeyType="done"
                  maxLength={5}
                />
              </View>
            </View>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <View style={styles.inputRow}>
              <MaterialIcons name="flag" size={20} color={accent} />
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Peso meta (kg)</Text>
                <TextInput
                  style={[styles.inputField, { color: textPrimary }]}
                  value={goalWeight}
                  onChangeText={setGoalWeight}
                  keyboardType="decimal-pad"
                  placeholderTextColor={textMuted}
                  returnKeyType="done"
                  maxLength={5}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Objetivo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>Objetivo Principal</Text>
          <View style={styles.objectivesGrid}>
            {OBJECTIVES.map((obj) => (
              <TouchableOpacity
                key={obj.key}
                style={[
                  styles.objectiveCard,
                  { backgroundColor: cardBg, borderColor: objective === obj.key ? accent : borderColor },
                  objective === obj.key && { backgroundColor: isDark ? "rgba(34,197,94,0.08)" : "rgba(22,163,74,0.08)" },
                ]}
                onPress={() => setObjective(obj.key)}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={obj.icon as any}
                  size={22}
                  color={objective === obj.key ? accent : textMuted}
                />
                <Text style={[styles.objectiveLabel, { color: objective === obj.key ? accent : textMuted }]}>
                  {obj.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nível de Atividade */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>Nível de Atividade</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            {ACTIVITY_LEVELS.map((level, idx) => (
              <React.Fragment key={level.key}>
                <TouchableOpacity
                  style={styles.activityRow}
                  onPress={() => setActivityLevel(level.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityLabel, { color: activityLevel === level.key ? accent : textPrimary }]}>
                      {level.label}
                    </Text>
                    <Text style={[styles.activityDesc, { color: textMuted }]}>{level.desc}</Text>
                  </View>
                  <View style={[styles.radioOuter, { borderColor: activityLevel === level.key ? accent : borderColor }]}>
                    {activityLevel === level.key && <View style={[styles.radioInner, { backgroundColor: accent }]} />}
                  </View>
                </TouchableOpacity>
                {idx < ACTIVITY_LEVELS.length - 1 && <View style={[styles.separator, { backgroundColor: borderColor }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Preferências */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>Preferências</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <MaterialIcons name="notifications" size={20} color={accent} />
                <View>
                  <Text style={[styles.toggleLabel, { color: textPrimary }]}>Notificações</Text>
                  <Text style={[styles.toggleDesc, { color: textMuted }]}>Lembretes de treino e dieta</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: borderColor, true: isDark ? "rgba(34,197,94,0.4)" : "rgba(22,163,74,0.4)" }}
                thumbColor={notificationsEnabled ? accent : textMuted}
              />
            </View>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <MaterialIcons name="alarm" size={20} color="#F97316" />
                <View>
                  <Text style={[styles.toggleLabel, { color: textPrimary }]}>Lembrete diário</Text>
                  <Text style={[styles.toggleDesc, { color: textMuted }]}>Notificação às 07:00</Text>
                </View>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: borderColor, true: "rgba(249,115,22,0.4)" }}
                thumbColor={reminderEnabled ? "#F97316" : textMuted}
              />
            </View>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            {/* DARK MODE TOGGLE — conectado ao ThemeProvider */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <MaterialIcons name="dark-mode" size={20} color="#A855F7" />
                <View>
                  <Text style={[styles.toggleLabel, { color: textPrimary }]}>Modo escuro</Text>
                  <Text style={[styles.toggleDesc, { color: textMuted }]}>
                    {isDark ? "Tema dark ativado" : "Tema claro ativado"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={(val) => setColorScheme(val ? "dark" : "light")}
                trackColor={{ false: borderColor, true: "rgba(168,85,247,0.4)" }}
                thumbColor={isDark ? "#A855F7" : textMuted}
              />
            </View>
          </View>
        </View>

        {/* Fotos de Evolução */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={[styles.sectionTitle, { color: textMuted, marginBottom: 0 }]}>Fotos de Evolução</Text>
            <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.7}>
              <Text style={{ fontSize: 12, color: accent, fontWeight: "700" }}>ADICIONAR</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            <View style={{ width: 100, height: 130, borderRadius: 12, backgroundColor: cardBg, borderColor, borderWidth: 1, borderStyle: "dashed", alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="add-a-photo" size={24} color={textMuted} />
              <Text style={{ fontSize: 10, color: textMuted, marginTop: 4 }}>Antes</Text>
            </View>
            <View style={{ width: 100, height: 130, borderRadius: 12, backgroundColor: cardBg, borderColor, borderWidth: 1, borderStyle: "dashed", alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="add-a-photo" size={24} color={textMuted} />
              <Text style={{ fontSize: 10, color: textMuted, marginTop: 4 }}>Depois</Text>
            </View>
            <View style={{ width: 100, height: 130, borderRadius: 12, backgroundColor: cardBg, borderColor, borderWidth: 1, borderStyle: "dashed", alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons name="history" size={24} color={textMuted} />
              <Text style={{ fontSize: 10, color: textMuted, marginTop: 4 }}>Histórico</Text>
            </View>
          </ScrollView>
        </View>

        {/* Conta */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textMuted }]}>Conta</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
              <MaterialIcons name="share" size={20} color={accent} />
              <Text style={[styles.actionLabel, { color: textPrimary }]}>Compartilhar progresso</Text>
              <MaterialIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
              <MaterialIcons name="help-outline" size={20} color="#3B82F6" />
              <Text style={[styles.actionLabel, { color: textPrimary }]}>Ajuda e suporte</Text>
              <MaterialIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
              <MaterialIcons name="privacy-tip" size={20} color={textMuted} />
              <Text style={[styles.actionLabel, { color: textPrimary }]}>Privacidade e termos</Text>
              <MaterialIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: borderColor }]} />
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={() => Alert.alert("Sair", "Tem certeza que deseja sair?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", style: "destructive" },
              ])}
            >
              <MaterialIcons name="logout" size={20} color="#EF4444" />
              <Text style={[styles.actionLabel, { color: "#EF4444" }]}>Sair da conta</Text>
              <MaterialIcons name="chevron-right" size={20} color={textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: accent }]} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  photoSection: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  photoWrapper: {
    position: "relative",
    width: 110,
    height: 110,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  photoBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: "800",
    borderBottomWidth: 1.5,
    paddingBottom: 4,
    minWidth: 120,
    textAlign: "center",
    lineHeight: 28,
  },
  memberSince: {
    fontSize: 12,
    lineHeight: 18,
  },

  imcCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  imcItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  imcValue: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },
  imcLabel: {
    fontSize: 11,
    lineHeight: 16,
  },
  imcDivider: {
    width: 1,
    marginVertical: 4,
  },

  section: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 18,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 2,
  },
  inputLabel: {
    fontSize: 11,
    lineHeight: 16,
  },
  inputField: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    padding: 0,
  },

  objectivesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  objectiveCard: {
    width: "30%",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  objectiveLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  activityInfo: { gap: 2 },
  activityLabel: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  activityDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  toggleDesc: {
    fontSize: 11,
    lineHeight: 16,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },

  saveButton: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
    lineHeight: 20,
  },
});
