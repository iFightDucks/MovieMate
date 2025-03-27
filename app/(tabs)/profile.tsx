import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Platform,
  Image
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

// This file exists just to satisfy the router
// Profile functionality to be implemented later
export default function ProfileScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>27</Text>
              <Text style={styles.statLabel}>Watched</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Watchlist</Text>
            </View>
          </View>
          
          <Text style={styles.comingSoon}>Profile settings coming soon</Text>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#333333',
  },
  comingSoon: {
    fontSize: 16,
    color: '#BBBBBB',
    marginTop: 20,
  },
}); 