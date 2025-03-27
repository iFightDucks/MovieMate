import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Platform,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Movie, useFavorites } from '../../hooks/use-favorites';
import { MovieCard } from '../../components/MovieCard';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

// This file exists just to satisfy the router
// Bookmarks navigation is handled in the tab layout
export default function BookmarksScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bookmarks</Text>
        </View>
        
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={({ item }: { item: Movie }) => (
              <MovieCard movie={item} />
            )}
            keyExtractor={(item) => item.imdbID}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          <View style={styles.content}>
            <Feather name="bookmark" size={50} color="#BBBBBB" />
            <Text style={styles.title}>No bookmarks yet</Text>
            <Text style={styles.subtitle}>Your bookmarked movies will appear here</Text>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/")}
            >
              <Text style={styles.buttonText}>Browse Movies</Text>
            </TouchableOpacity>
          </View>
        )}
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
}); 