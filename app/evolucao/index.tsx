import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import * as ImagePicker from "expo-image-picker";

interface EvolutionPhoto {
  id: string;
  uri: string;
  date: string;
  weight: string;
  label: string;
}

export default function EvolucaoScreen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<EvolutionPhoto[]>([
    { 
      id: "1", 
      uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80", 
      date: "15 Jan 2025", 
      weight: "88.0 kg",
      label: "Início da Jornada"
    },
    { 
      id: "2", 
      uri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80", 
      date: "18 Mar 2025", 
      weight: "82.0 kg",
      label: "Atual"
    },
  ]);

  const handleAddPhoto = async () => {
    if (Platform.OS === "web") {
      const newPhoto: EvolutionPhoto = {
        id: Date.now().toString(),
        uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
        weight: "81.5 kg",
        label: "Nova Foto"
      };
      setPhotos([newPhoto, ...photos]);
      return;
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Precisamos de acesso para adicionar fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto: EvolutionPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
        weight: "82.0 kg",
        label: "Progresso"
      };
      setPhotos([newPhoto, ...photos]);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Evolução</Text>
        <TouchableOpacity onPress={handleAddPhoto} style={styles.addBtn}>
          <MaterialIcons name="add-a-photo" size={22} color="#22C55E" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>-6.0kg</Text>
            <Text style={styles.summaryLabel}>Perdidos</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>64 dias</Text>
            <Text style={styles.summaryLabel}>Foco Total</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>LINHA DO TEMPO VISUAL</Text>

        <View style={styles.gallery}>
          {photos.map((photo) => (
            <View key={photo.id} style={styles.photoCard}>
              <Image source={{ uri: photo.uri }} style={styles.photoImage} />
              <View style={styles.photoOverlay}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{photo.date}</Text>
                </View>
                <View style={styles.weightBadge}>
                  <Text style={styles.weightText}>{photo.weight}</Text>
                </View>
              </View>
              <View style={styles.photoFooter}>
                <Text style={styles.photoLabel}>{photo.label}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Excluir", "Deseja remover esta foto?")}>
                  <MaterialIcons name="more-vert" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addPlaceholder} onPress={handleAddPhoto}>
            <MaterialIcons name="add-a-photo" size={32} color="#22C55E" />
            <Text style={styles.addPlaceholderText}>ADICIONAR FOTO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  addBtn: {
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
  content: {
    padding: 20,
    gap: 20,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22C55E",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#2A2A2A",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 1.5,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  photoCard: {
    width: "47%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  photoImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#0D0D0D",
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateBadge: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  weightBadge: {
    backgroundColor: "rgba(34,197,94,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weightText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000000",
  },
  photoFooter: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addPlaceholder: {
    width: "47%",
    height: 250,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#22C55E",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "rgba(34,197,94,0.03)",
  },
  addPlaceholderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#22C55E",
    letterSpacing: 0.5,
  },
});
