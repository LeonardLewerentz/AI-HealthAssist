import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // The Stack component from expo-router implicitly provides NavigationContainer
    <Stack>
      {/* You can define screen options here or in individual files */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Example: If you want to customize the "voice-input" route header */}
      <Stack.Screen name="voice-input" options={{ title: "Describe Symptoms" }} />
      <Stack.Screen name="summary-result" options={{ title: "AI Summary" }} />
      <Stack.Screen name="submit-form" options={{ title: "Submit Form" }} />
      <Stack.Screen name="success-screen" options={{ title: "Success" }} />

      {/* ... and so on for other screens */}
    </Stack>
  );
}
