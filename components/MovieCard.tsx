import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Movie, useFavorites } from '../hooks/use-favorites';

const { width } = Dimensions.get('window');
// We'll adjust sizing to be more flexible based on parent container
// and rely less on fixed dimensions

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(movie.imdbID);

  const handleToggleFavorite = (e: GestureResponderEvent) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/movie/${movie.imdbID}`)}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        {movie.Poster && movie.Poster !== 'N/A' ? (
          <Image
            source={{ uri: movie.Poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <FontAwesome name="film" size={40} color="#888" />
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFav && styles.favoriteButtonActive
          ]}
          onPress={handleToggleFavorite}
        >
          <FontAwesome 
            name={isFav ? "star" : "star-o"} 
            size={16} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text 
          style={styles.title} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {movie.Title}
        </Text>
        <Text style={styles.year}>
          {movie.Year}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  posterContainer: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    aspectRatio: 2/3, // Standard movie poster ratio
    backgroundColor: '#2C2C2C',
  },
  noPoster: {
    width: '100%',
    aspectRatio: 2/3,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#BB86FC',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: '#BBBBBB',
  },
});