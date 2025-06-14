import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router'; // Import router for navigation

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Patient Sign In"
        onPress={() => router.push('/login')} // Assuming `voice-input.jsx`
      />
      <Button
        title="Go to Patient Sign Up"
        onPress={() => router.push('/signup')} // Assuming `voice-input.jsx`
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



