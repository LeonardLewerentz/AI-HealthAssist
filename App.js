import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import TranscribeScreen from './screens/TranscribeScreen';
import SummaryScreen from './screens/SummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Voice Input" component={TranscribeScreen} />
        <Stack.Screen 
          name="SummaryResult" 
          component={SummaryResultScreen} 
          options={{ title: 'Summary Result' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


