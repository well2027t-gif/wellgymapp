import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { PROFESSIONALS, Professional } from "@/lib/data";

type TabType = "personal" | "nutritionist";

export default function ProfissionaisScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const router = useRouter();

  const filtered = PROFESSIONALS.filter((p) => p.type === activeTab);

  const handleContact = (pro: Professional) => {
    router.push(`/chat/${pro.id}` as Href);
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Profissionais</Text>
          <Text style={styles.subtitle}>Conecte-se com especialistas</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "personal" && styles.tabActive]}
          onPress={() => setActiveTab("personal")}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="fitness-center"
            size={16}
            color={activeTab === "personal" ? "#000000" : "#6B7280"}
          />
          <Text style={[styles.tabText, activeTab === "personal" && styles.tabTextActive]}>
            Personal Trainer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "nutritionist" && styles.tabActive]}
          onPress={() => setActiveTab("nutritionist")}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="restaurant"
            size={16}
            color={activeTab === "nutritionist" ? "#000000" : "#6B7280"}
          />
          <Text
            style={[styles.tabText, activeTab === "nutritionist" && styles.tabTextActive]}
          >
            Nutricionista
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((pro) => (
          <ProfessionalCard key={pro.id} pro={pro} onContact={() => handleContact(pro)} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

function ProfessionalCard({
  pro,
  onContact,
}: {
  pro: Professional;
  onContact: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={cardStyles.card}>
      {/* Top Row */}
      <View style={cardStyles.top}>
        <Image source={{ uri: pro.avatar }} style={cardStyles.avatar} />
        <View style={cardStyles.info}>
          <View style={cardStyles.nameRow}>
            <Text style={cardStyles.name}>{pro.name}</Text>
            <View
              style={[
                cardStyles.availableBadge,
                !pro.available && cardStyles.unavailableBadge,
              ]}
            >
              <View
                style={[
                  cardStyles.availableDot,
                  !pro.available && cardStyles.unavailableDot,
                ]}
              />
              <Text
                style={[
                  cardStyles.availableText,
                  !pro.available && cardStyles.unavailableText,
                ]}
              >
                {pro.available ? "Disponível" : "Ocupado"}
              </Text>
            </View>
          </View>
          <Text style={cardStyles.specialty}>{pro.specialty}</Text>
          <View style={cardStyles.ratingRow}>
            <MaterialIcons name="star" size={13} color="#F59E0B" />
            <Text style={cardStyles.rating}>{pro.rating}</Text>
            <Text style={cardStyles.reviews}>({pro.reviews} avaliações)</Text>
            <Text style={cardStyles.experience}>• {pro.experience}</Text>
          </View>
        </View>
      </View>

      {/* Specialties */}
      <View style={cardStyles.specialties}>
        {pro.specialties.map((s) => (
          <View key={s} style={cardStyles.specialtyTag}>
            <Text style={cardStyles.specialtyText}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Bio toggle */}
      <TouchableOpacity
        style={cardStyles.bioToggle}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={cardStyles.bioToggleText}>
          {expanded ? "Ver menos" : "Ver perfil completo"}
        </Text>
        <MaterialIcons
          name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={18}
          color="#22C55E"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={cardStyles.bio}>
          <Text style={cardStyles.bioText}>{pro.bio}</Text>
        </View>
      )}

      {/* Contact Button */}
      <TouchableOpacity
        style={[cardStyles.contactBtn, !pro.available && cardStyles.contactBtnDisabled]}
        onPress={onContact}
        activeOpacity={0.85}
      >
        <MaterialIcons
          name="chat"
          size={18}
          color={pro.available ? "#000000" : "#6B7280"}
        />
        <Text
          style={[
            cardStyles.contactBtnText,
            !pro.available && cardStyles.contactBtnTextDisabled,
          ]}
        >
          {pro.available ? "Conversar agora" : "Indisponível"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 12,
  },
  top: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2A2A2A",
    borderWidth: 2,
    borderColor: "#22C55E",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 22,
    flex: 1,
  },
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  unavailableBadge: {
    backgroundColor: "rgba(107,114,128,0.12)",
    borderColor: "rgba(107,114,128,0.3)",
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  unavailableDot: {
    backgroundColor: "#6B7280",
  },
  availableText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#22C55E",
    lineHeight: 14,
  },
  unavailableText: {
    color: "#6B7280",
  },
  specialty: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  rating: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 18,
  },
  reviews: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  experience: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  specialtyText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    lineHeight: 16,
  },
  bioToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bioToggleText: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
    lineHeight: 18,
  },
  bio: {
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  bioText: {
    fontSize: 13,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  contactBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contactBtnDisabled: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  contactBtnTextDisabled: {
    color: "#6B7280",
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
    lineHeight: 18,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: "#22C55E",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    lineHeight: 18,
  },
  tabTextActive: {
    color: "#000000",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
});
