import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";

interface ExerciseInput {
  id: string;
  name: string;
  sets: string;
  reps: string;
}

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { id: "1", name: "", sets: "", reps: "" },
  ]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: "", sets: "", reps: "" },
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((ex) => ex.id !== id));
    }
  };

  const updateExercise = (id: string, field: keyof ExerciseInput, value: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSave = () => {
    if (!workoutName.trim()) {
      Alert.alert("Erro", "Por favor, insira o nome do treino.");
      return;
    }
    Alert.alert("Sucesso", "Treino criado com sucesso!");
    router.back();
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Treino</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Nome do Treino</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Peito e Tríceps"
            placeholderTextColor="#6B7280"
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        <Text style={styles.sectionTitle}>EXERCÍCIOS</Text>
        {exercises.map((ex, index) => (
          <View key={ex.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseNumber}>#{index + 1}</Text>
              <TouchableOpacity onPress={() => removeExercise(ex.id)}>
                <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome do exercício"
              placeholderTextColor="#6B7280"
              value={ex.name}
              onChangeText={(v) => updateExercise(ex.id, "name", v)}
            />

            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <Text style={styles.labelSmall}>Séries</Text>
                <TextInput
                  style={styles.inputSmall}
                  placeholder="4"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  value={ex.sets}
                  onChangeText={(v) => updateExercise(ex.id, "sets", v)}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.labelSmall}>Reps/Tempo</Text>
                <TextInput
                  style={styles.inputSmall}
                  placeholder="12"
                  placeholderTextColor="#6B7280"
                  value={ex.reps}
                  onChangeText={(v) => updateExercise(ex.id, "reps", v)}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addExerciseBtn} onPress={addExercise}>
          <MaterialIcons name="add" size={20} color="#22C55E" />
          <Text style={styles.addExerciseText}>ADICIONAR EXERCÍCIO</Text>
        </TouchableOpacity>
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
    fontWeight: "700",
    color: "#FFFFFF",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22C55E",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D1D5DB",
  },
  labelSmall: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  exerciseCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: "#22C55E",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputSmall: {
    backgroundColor: "#0D0D0D",
    borderRadius: 10,
    padding: 10,
    color: "#FFFFFF",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  addExerciseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#22C55E",
    borderStyle: "dashed",
    gap: 8,
    marginTop: 8,
  },
  addExerciseText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#22C55E",
    letterSpacing: 0.5,
  },
});

