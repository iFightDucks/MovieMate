import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function SearchScreen() {
  const router = useRouter();
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftPlaceholder} />
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.replace("/")}
          >
            <Feather name="home" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Feather name="search" size={50} color="#BBBBBB" />
          <Text style={styles.title}>Search Movies</Text>
          <Text style={styles.subtitle}>Coming soon</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftPlaceholder: {
    width: 40,
    height: 40,
    opacity: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 