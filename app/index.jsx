import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router'; // Import router for navigation

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Camera"
        onPress={() => router.push('/camera')} // Navigate using expo-router's router
      />
      <Button
        title="Go to Voice Input"
        onPress={() => router.push('/voice-input')} // Assuming `voice-input.jsx`
      />
      <Button
        title="Go to Summary"
        onPress={() => router.push('/summary')} // Assuming `voice-input.jsx`
      />
      {/* Add other buttons as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



