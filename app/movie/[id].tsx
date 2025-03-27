import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Movie as BaseMovie, useFavorites } from '../../hooks/use-favorites';

// Extended Movie interface for the details screen
interface MovieDetails extends BaseMovie {
  Director: string;
  Plot: string;
  Runtime: string;
  Rated: string;
  Genre: string;
  imdbRating: string;
  Actors: string;
  Writer: string;
}

const { width } = Dimensions.get('window');
const POSTER_HEIGHT = width * 1.5;

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/movies/details', id],
    queryFn: async () => {
      try {
        const apiKey = '3e974fca';
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${id as string}&plot=full`
        );
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(data.Error || 'Failed to fetch movie details');
        }
        return data as MovieDetails;
      } catch (error) {
        throw new Error('Failed to fetch movie details');
      }
    },
  });

  const handleToggleFavorite = () => {
    if (!data) return;
    toggleFavorite(data);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>
          Loading movie details...
        </Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={50} color="#BB86FC" />
        <Text style={styles.errorText}>
          Failed to load movie details.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = isFavorite(data.imdbID);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} bounces={false}>
        {/* Header with back button and favorite button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteButton,
              isFav && styles.favoriteButtonActive
            ]}
          >
            <Feather 
              name="heart" 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Movie poster */}
        {data.Poster && data.Poster !== 'N/A' ? (
          <Image
            source={{ uri: data.Poster }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noPoster}>
            <Feather name="film" size={50} color="#555" />
            <Text style={styles.noPosterText}>
              No poster available
            </Text>
          </View>
        )}

        {/* Movie info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {data.Title}
          </Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.year}>
              {data.Year}
            </Text>
            {data.Runtime && data.Runtime !== 'N/A' && (
              <Text style={styles.meta}>
                • {data.Runtime}
              </Text>
            )}
            {data.Rated && data.Rated !== 'N/A' && (
              <Text style={styles.meta}>
                • {data.Rated}
              </Text>
            )}
          </View>

          {data.Genre && data.Genre !== 'N/A' && (
            <View style={styles.genreContainer}>
              {data.Genre.split(', ').map((genre: string, index: number) => (
                <View 
                  key={index}
                  style={styles.genrePill}
                >
                  <Text style={styles.genreText}>
                    {genre}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {data.imdbRating && data.imdbRating !== 'N/A' && (
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color="#F5C518" />
              <Text style={styles.rating}>
                {data.imdbRating}<Text style={styles.ratingDenominator}>/10 IMDb</Text>
              </Text>
            </View>
          )}

          {data.Plot && data.Plot !== 'N/A' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Story Line
              </Text>
              <Text style={styles.plot}>
                {data.Plot}
              </Text>
            </View>
          )}

          {/* Cast & Crew Section */}
          <View style={styles.castCrewContainer}>
            {/* Director */}
            {data.Director && data.Director !== 'N/A' && (
              <View style={styles.crewItem}>
                <Text style={styles.crewLabel}>Director</Text>
                <Text style={styles.crewValue}>{data.Director}</Text>
              </View>
            )}
            
            {/* Cast */}
            {data.Actors && data.Actors !== 'N/A' && (
              <View style={styles.crewItem}>
                <Text style={styles.crewLabel}>Cast</Text>
                <Text style={styles.crewValue}>{data.Actors}</Text>
              </View>
            )}
            
            {/* Writer */}
            {data.Writer && data.Writer !== 'N/A' && (
              <View style={styles.crewItem}>
                <Text style={styles.crewLabel}>Writer</Text>
                <Text style={styles.crewValue}>{data.Writer}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#BBBBBB',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: '#BBBBBB',
    marginTop: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    padding: 16,
    zIndex: 10,
    width: '100%',
    top: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#BB86FC',
  },
  poster: {
    width: '100%',
    height: POSTER_HEIGHT,
    marginBottom: -100,
  },
  noPoster: {
    width: '100%',
    height: width * 0.8,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#777',
    marginTop: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  year: {
    fontSize: 16,
    color: '#BBBBBB',
  },
  meta: {
    fontSize: 16,
    color: '#BBBBBB',
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genrePill: {
    backgroundColor: '#2C2C2C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  ratingDenominator: {
    fontWeight: 'normal',
    color: '#BBBBBB',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#BBBBBB',
  },
  castCrewContainer: {
    marginBottom: 24,
  },
  crewItem: {
    marginBottom: 16,
  },
  crewLabel: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 4,
  },
  crewValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});