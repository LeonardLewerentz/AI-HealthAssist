// utils/storage.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Always import AsyncStorage, it's cross-platform RN

let SecureStore = null;

// Conditionally attempt to import expo-secure-store
// This approach tries to import it, and if it fails (e.g., on web)
// due to native module issues, it will gracefully handle the error.
// The bundler should ideally optimize this out for web builds.
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  try {
    // Note: Using a dynamic import() with await means the SecureStore variable
    // will be assigned asynchronously. This changes how you interact with it
    // slightly or requires ensuring it's loaded before use.
    // For synchronous conditional loading in ESM, direct import *only* works
    // if the module correctly handles non-native environments or if the bundler
    // supports tree-shaking it out perfectly.
    // A more robust pattern for true dynamic import:
    import('expo-secure-store')
      .then(module => {
        SecureStore = module;
      })
      .catch(error => {
        console.warn("Failed to load expo-secure-store. Falling back to AsyncStorage.", error);
        SecureStore = null; // Ensure it's null if loading failed
      });
  } catch (e) {
    // This catch might handle synchronous errors if the module path is entirely wrong
    // or if the bundler has a strict check. For native modules, the async import().catch
    // is usually where the failure occurs.
    console.warn("Synchronous catch: Failed to import expo-secure-store.", e);
    SecureStore = null;
  }
}

// Helper function to get SecureStore if it's loaded, otherwise null
const getSecureStore = async () => {
  // If the initial async import hasn't completed yet, wait for it
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (SecureStore === null && SecureStore !== undefined) { // Check if it's being loaded or failed
      // You might want to add a more sophisticated loading state here,
      // but for this example, we'll just return null if not ready.
      // In a real app, you might want to delay operations until SecureStore is confirmed loaded.
      return null;
    }
    return SecureStore;
  }
  return null;
};


const setItem = async (key, value) => {
  if (Platform.OS === 'web') {
    sessionStorage.setItem(key, value);
  } else {
    const ss = await getSecureStore();
    if (ss) {
      try {
        await ss.setItemAsync(key, value);
      } catch (error) {
        console.error(`SecureStore.setItemAsync failed for key "${key}":`, error);
        console.warn("Falling back to AsyncStorage for mobile token storage due to SecureStore error.");
        await AsyncStorage.setItem(key, value);
      }
    } else {
      console.warn("SecureStore not available, falling back to AsyncStorage for mobile token storage.");
      await AsyncStorage.setItem(key, value);
    }
  }
};

const getItem = async (key) => {
  if (Platform.OS === 'web') {
    sessionStorage.setItem("dummy", "dummy");
    const value = sessionStorage.getItem(key);
    return value !== null ? value : null; // Return null if no item is found
  } else {
    const ss = await getSecureStore();
    if (ss) {
      try {
        const value = await ss.getItemAsync(key);
        return value !== null ? value : null; // Return null if no item is found
      } catch (error) {
        console.error(`SecureStore.getItemAsync failed for key "${key}":`, error);
        console.warn("Falling back to AsyncStorage for mobile token retrieval due to SecureStore error.");
        const fallbackValue = await AsyncStorage.getItem(key);
        return fallbackValue !== null ? fallbackValue : null; // Return null if no item is found
      }
    } else {
      console.warn("SecureStore not available, falling back to AsyncStorage for mobile token retrieval.");
      const fallbackValue = await AsyncStorage.getItem(key);
      return fallbackValue !== null ? fallbackValue : null; // Return null if no item is found
    }
  }
};


const removeItem = async (key) => {
  if (Platform.OS === 'web') {
    sessionStorage.removeItem(key);
  } else {
    const ss = await getSecureStore();
    if (ss) {
      try {
        await ss.deleteItemAsync(key); // SecureStore uses deleteItemAsync
      } catch (error) {
        console.error(`SecureStore.deleteItemAsync failed for key "${key}":`, error);
        console.warn("Falling back to AsyncStorage for mobile token removal due to SecureStore error.");
        await AsyncStorage.removeItem(key);
      }
    } else {
      console.warn("SecureStore not available, falling back to AsyncStorage for mobile token removal.");
      await AsyncStorage.removeItem(key);
    }
  }
};

export default {
  setItem,
  getItem,
  removeItem,
};
