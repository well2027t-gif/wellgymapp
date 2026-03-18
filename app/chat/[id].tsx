import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PROFESSIONALS, AUTO_REPLIES, ChatMessage } from "@/lib/data";

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("treino") || lower.includes("exerc") || lower.includes("muscula")) {
    const replies = AUTO_REPLIES.treino;
    return replies[Math.floor(Math.random() * replies.length)];
  }
  if (lower.includes("dieta") || lower.includes("aliment") || lower.includes("nutri") || lower.includes("comer")) {
    const replies = AUTO_REPLIES.dieta;
    return replies[Math.floor(Math.random() * replies.length)];
  }
  if (lower.includes("dor") || lower.includes("les") || lower.includes("machuc")) {
    const replies = AUTO_REPLIES.dor;
    return replies[Math.floor(Math.random() * replies.length)];
  }
  const replies = AUTO_REPLIES.default;
  return replies[Math.floor(Math.random() * replies.length)];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateHeader(date: Date): string {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  if (isToday) return "Hoje";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init1",
    text: "Olá! Seja bem-vindo(a)! 👋 Como posso te ajudar hoje?",
    sender: "professional",
    timestamp: new Date(Date.now() - 60000 * 5),
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const pro = PROFESSIONALS.find((p) => p.id === id) ?? PROFESSIONALS[0];
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    scrollToBottom();

    // Simulate professional typing and reply
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const reply = getAutoReply(text);
      const proMsg: ChatMessage = {
        id: `p${Date.now()}`,
        text: reply,
        sender: "professional",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, proMsg]);
      setIsTyping(false);
    }, delay);
  }, [inputText, scrollToBottom]);

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const dateStr = formatDateHeader(msg.timestamp);
    const last = groupedMessages[groupedMessages.length - 1];
    if (!last || last.date !== dateStr) {
      groupedMessages.push({ date: dateStr, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Image source={{ uri: pro.avatar }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{pro.name}</Text>
          <View style={styles.headerStatus}>
            <View style={[styles.statusDot, !pro.available && styles.statusDotOffline]} />
            <Text style={[styles.statusText, !pro.available && styles.statusTextOffline]}>
              {pro.available ? "Online agora" : "Offline"}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
          <MaterialIcons name="more-vert" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={[
            styles.messageListContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {groupedMessages.map((group) => (
            <View key={group.date}>
              {/* Date header */}
              <View style={styles.dateHeader}>
                <View style={styles.dateLine} />
                <Text style={styles.dateText}>{group.date}</Text>
                <View style={styles.dateLine} />
              </View>
              {group.messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} proAvatar={pro.avatar} />
              ))}
            </View>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.typingRow}>
              <Image source={{ uri: pro.avatar }} style={styles.typingAvatar} />
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite uma mensagem..."
              placeholderTextColor="#6B7280"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={inputText.trim() ? "#000000" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function MessageBubble({
  msg,
  proAvatar,
}: {
  msg: ChatMessage;
  proAvatar: string;
}) {
  const isUser = msg.sender === "user";
  return (
    <View style={[bubbleStyles.row, isUser && bubbleStyles.rowUser]}>
      {!isUser && (
        <Image source={{ uri: proAvatar }} style={bubbleStyles.avatar} />
      )}
      <View style={[bubbleStyles.bubble, isUser ? bubbleStyles.bubbleUser : bubbleStyles.bubblePro]}>
        <Text style={[bubbleStyles.text, isUser && bubbleStyles.textUser]}>
          {msg.text}
        </Text>
        <Text style={[bubbleStyles.time, isUser && bubbleStyles.timeUser]}>
          {formatTime(msg.timestamp)}
          {isUser && (
            <Text>{"  "}<MaterialIcons name="done-all" size={12} color="rgba(255,255,255,0.6)" /></Text>
          )}
        </Text>
      </View>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  rowUser: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A2A2A",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubblePro: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "#22C55E",
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  textUser: {
    color: "#000000",
  },
  time: {
    fontSize: 10,
    color: "#6B7280",
    alignSelf: "flex-end",
    lineHeight: 14,
  },
  timeUser: {
    color: "rgba(0,0,0,0.5)",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    borderWidth: 2,
    borderColor: "#22C55E",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  statusDotOffline: {
    backgroundColor: "#6B7280",
  },
  statusText: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "600",
    lineHeight: 16,
  },
  statusTextOffline: {
    color: "#6B7280",
  },
  headerAction: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  messageListContent: {
    paddingTop: 16,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 12,
    gap: 10,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1E1E1E",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    lineHeight: 16,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  typingAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A2A2A",
  },
  typingBubble: {
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#6B7280",
  },
  typingDot1: { opacity: 1 },
  typingDot2: { opacity: 0.7 },
  typingDot3: { opacity: 0.4 },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
});
