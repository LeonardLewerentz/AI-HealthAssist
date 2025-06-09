import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Capture Image" onPress={() => navigation.navigate('Camera')} />
      <Button title="Voice Input" onPress={() => navigation.navigate('Voice Input')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 20, padding: 20 },
});

