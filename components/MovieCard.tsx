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
const CARD_WIDTH = width * 0.425; // Allows for 2 cards per row with spacing

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
      </View>

      <View style={styles.info}>
        <Text 
          style={styles.title} 
          numberOfLines={2}
        >
          {movie.Title}
        </Text>
        <Text style={styles.year}>
          {movie.Year}
        </Text>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <View style={styles.favoriteContent}>
            <FontAwesome 
              name={isFav ? "star" : "star-o"} 
              size={16} 
              color={isFav ? '#ff6b6b' : '#999'} 
            />
            <Text style={{ color: isFav ? '#ff6b6b' : '#999', marginLeft: 6 }}>
              {isFav ? 'Favorite' : 'Add to Favorites'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
    marginHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
  },
  posterContainer: {
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#2C2C2C',
  },
  noPoster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: '#BBBBBB',
    marginBottom: 8,
  },
  favoriteButton: {
    marginTop: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});