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

interface MealInput {
  id: string;
  name: string;
  time: string;
  items: string;
  calories: string;
}

export default function CreateDietScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<MealInput[]>([
    { id: "1", name: "Café da Manhã", time: "08:00", items: "", calories: "" },
  ]);

  const addMeal = () => {
    setMeals([
      ...meals,
      { id: Date.now().toString(), name: "", time: "", items: "", calories: "" },
    ]);
  };

  const removeMeal = (id: string) => {
    if (meals.length > 1) {
      setMeals(meals.filter((m) => m.id !== id));
    }
  };

  const updateMeal = (id: string, field: keyof MealInput, value: string) => {
    setMeals(
      meals.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = () => {
    Alert.alert("Sucesso", "Dieta salva com sucesso!");
    router.back();
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Dieta</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>REFEIÇÕES DIÁRIAS</Text>
        
        {meals.map((meal, index) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealNumber}>Refeição #{index + 1}</Text>
              <TouchableOpacity onPress={() => removeMeal(meal.id)}>
                <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 2 }}>
                <Text style={styles.labelSmall}>Nome da Refeição</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Almoço"
                  placeholderTextColor="#6B7280"
                  value={meal.name}
                  onChangeText={(v) => updateMeal(meal.id, "name", v)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelSmall}>Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder="12:00"
                  placeholderTextColor="#6B7280"
                  value={meal.time}
                  onChangeText={(v) => updateMeal(meal.id, "time", v)}
                />
              </View>
            </View>

            <View>
              <Text style={styles.labelSmall}>Alimentos (separados por vírgula)</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                placeholder="Ex: 200g Frango, 150g Arroz..."
                placeholderTextColor="#6B7280"
                multiline
                value={meal.items}
                onChangeText={(v) => updateMeal(meal.id, "items", v)}
              />
            </View>

            <View>
              <Text style={styles.labelSmall}>Calorias Estimadas</Text>
              <TextInput
                style={styles.input}
                placeholder="500"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={meal.calories}
                onChangeText={(v) => updateMeal(meal.id, "calories", v)}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addMealBtn} onPress={addMeal}>
          <MaterialIcons name="restaurant" size={20} color="#22C55E" />
          <Text style={styles.addMealText}>ADICIONAR REFEIÇÃO</Text>
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1,
  },
  mealCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: "#22C55E",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  labelSmall: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  addMealBtn: {
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
  addMealText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#22C55E",
    letterSpacing: 0.5,
  },
});

