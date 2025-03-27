import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Movie, SearchResponse, useFavorites } from '../../hooks/use-favorites';
import { SearchBar } from '../../components/SearchBar';
import { MovieCard } from '../../components/MovieCard';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const router = useRouter();

  const searchQuery = useQuery({
    queryKey: ['/api/movies/search', searchTerm, page],
    queryFn: async () => {
      if (!searchTerm) return null;
      try {
        const apiKey = '3e974fca';
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${page}`
        );
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(data.Error || 'Failed to search movies');
        }
        return data as SearchResponse;
      } catch (error) {
        throw new Error('Failed to search movies');
      }
    },
    enabled: !!searchTerm,
  });

  const popularMoviesQuery = useQuery({
    queryKey: ['/api/movies/popular'],
    queryFn: async () => {
      try {
        const apiKey = '3e974fca';
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=marvel&page=1`
        );
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(data.Error || 'Failed to fetch popular movies');
        }
        return data as SearchResponse;
      } catch (error) {
        throw new Error('Failed to fetch popular movies');
      }
    },
    enabled: !searchTerm,
  });

  const trendingMoviesQuery = useQuery({
    queryKey: ['/api/movies/trending'],
    queryFn: async () => {
      try {
        const apiKey = '3e974fca';
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=action&y=2023&page=1`
        );
        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error(data.Error || 'Failed to fetch trending movies');
        }
        return data as SearchResponse;
      } catch (error) {
        throw new Error('Failed to fetch trending movies');
      }
    },
    enabled: !searchTerm,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    setAllMovies([]); 
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Effect to accumulate movies when new data comes in
  useEffect(() => {
    if (searchQuery.data?.Search && searchTerm) {
      // If it's page 1, replace all movies, otherwise append
      if (page === 1) {
        setAllMovies(searchQuery.data.Search);
      } else {
        // Ensure we don't add duplicate movies when adding new page results
        const newMovieIds = new Set(searchQuery.data.Search.map((m: Movie) => m.imdbID));
        const filteredExistingMovies = allMovies.filter((m: Movie) => !newMovieIds.has(m.imdbID));
        setAllMovies([...filteredExistingMovies, ...searchQuery.data.Search]);
      }
    }
  }, [searchQuery.data, page, searchTerm]);

  const isLoading = (searchTerm ? searchQuery.isLoading : popularMoviesQuery.isLoading) && page === 1;
  const isFetchingMore = searchQuery.isFetching && page > 1;
  const isError = searchTerm ? searchQuery.isError : popularMoviesQuery.isError;
  
  // Use accumulated movies for search results, or just the popular movies data
  const movies: Movie[] = searchTerm 
    ? allMovies
    : (popularMoviesQuery.data?.Search || []);
  
  const trendingMovies: Movie[] = trendingMoviesQuery.data?.Search || [];
  
  const totalResults = searchTerm 
    ? parseInt(searchQuery.data?.totalResults || '0') 
    : parseInt(popularMoviesQuery.data?.totalResults || '0');

  const hasMore = movies.length < totalResults;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/favorites")}
        >
          <Feather name="heart" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      
      {searchTerm ? (
        <Text style={styles.sectionTitle}>
          Search Results
        </Text>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Movies</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={trendingMovies.slice(0, 5)}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => `trending-${item.imdbID}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={isFetchingMore}
      >
        {isFetchingMore ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.loadMoreText}>Load More</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF375F" />
          <Text style={styles.emptyText}>
            Loading movies...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={50} color="#FF375F" />
          <Text style={styles.emptyText}>
            Something went wrong. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (searchTerm) {
                setPage(1);
                searchQuery.refetch();
              } else {
                popularMoviesQuery.refetch();
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (movies.length === 0 && searchTerm) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="film" size={50} color="#BBBBBB" />
          <Text style={styles.emptyText}>
            No movies found. Try a different search.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          data={movies}
          renderItem={({ item }) => <MovieCard movie={item} />}
          keyExtractor={(item) => item.imdbID}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 24,
    paddingTop: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 40,
    height: 40,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#BB86FC',
  },
  horizontalList: {
    paddingBottom: 24,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: '#BBBBBB',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#BB86FC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadMoreButton: {
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 30,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
