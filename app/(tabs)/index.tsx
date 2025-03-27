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
const CARD_WIDTH = (width - 48) / 2; // 16px padding on each side + 16px gap between cards

type ViewMode = 'default' | 'all-popular' | 'all-trending';

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('default');
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
    queryKey: ['/api/movies/popular', viewMode === 'all-popular' ? page : 1],
    queryFn: async () => {
      try {
        const apiKey = '3e974fca';
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=marvel&page=${viewMode === 'all-popular' ? page : 1}`
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
    queryKey: ['/api/movies/trending', viewMode === 'all-trending' ? page : 1],
    queryFn: async () => {
      try {
        const apiKey = '3e974fca';
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=action&y=2023&page=${viewMode === 'all-trending' ? page : 1}`
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
    setViewMode('default');
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSeeAllPopular = () => {
    setViewMode('all-popular');
    setPage(1);
    setAllMovies([]);
  };

  const handleSeeAllTrending = () => {
    setViewMode('all-trending');
    setPage(1);
    setAllMovies([]);
  };

  const handleBackToHome = () => {
    setViewMode('default');
    setPage(1);
    setAllMovies([]);
    setSearchTerm('');
  };

  useEffect(() => {
    if (searchTerm && searchQuery.data?.Search) {
      if (page === 1) {
        setAllMovies(searchQuery.data.Search);
      } else {
        const newMovieIds = new Set(searchQuery.data.Search.map(m => m.imdbID));
        const filteredExistingMovies = allMovies.filter(m => !newMovieIds.has(m.imdbID));
        setAllMovies([...filteredExistingMovies, ...searchQuery.data.Search]);
      }
    } else if (viewMode === 'all-popular' && popularMoviesQuery.data?.Search) {
      if (page === 1) {
        setAllMovies(popularMoviesQuery.data.Search);
      } else {
        const newMovieIds = new Set(popularMoviesQuery.data.Search.map(m => m.imdbID));
        const filteredExistingMovies = allMovies.filter(m => !newMovieIds.has(m.imdbID));
        setAllMovies([...filteredExistingMovies, ...popularMoviesQuery.data.Search]);
      }
    } else if (viewMode === 'all-trending' && trendingMoviesQuery.data?.Search) {
      if (page === 1) {
        setAllMovies(trendingMoviesQuery.data.Search);
      } else {
        const newMovieIds = new Set(trendingMoviesQuery.data.Search.map(m => m.imdbID));
        const filteredExistingMovies = allMovies.filter(m => !newMovieIds.has(m.imdbID));
        setAllMovies([...filteredExistingMovies, ...trendingMoviesQuery.data.Search]);
      }
    }
  }, [searchQuery.data, popularMoviesQuery.data, trendingMoviesQuery.data, page, searchTerm, viewMode]);

  const isLoading = (
    (searchTerm ? searchQuery.isLoading : 
      viewMode === 'all-popular' ? popularMoviesQuery.isLoading :
      viewMode === 'all-trending' ? trendingMoviesQuery.isLoading :
      popularMoviesQuery.isLoading)
    && page === 1
  );

  const isFetchingMore = (
    searchTerm ? searchQuery.isFetching :
    viewMode === 'all-popular' ? popularMoviesQuery.isFetching :
    viewMode === 'all-trending' ? trendingMoviesQuery.isFetching :
    false
  ) && page > 1;

  const isError = searchTerm ? searchQuery.isError : 
    viewMode === 'all-popular' ? popularMoviesQuery.isError :
    viewMode === 'all-trending' ? trendingMoviesQuery.isError :
    popularMoviesQuery.isError;

  const movies = searchTerm || viewMode !== 'default' 
    ? allMovies
    : (popularMoviesQuery.data?.Search || []);
  
  const trendingMovies = trendingMoviesQuery.data?.Search || [];
  
  const totalResults = searchTerm 
    ? parseInt(searchQuery.data?.totalResults || '0')
    : viewMode === 'all-popular'
    ? parseInt(popularMoviesQuery.data?.totalResults || '0')
    : viewMode === 'all-trending'
    ? parseInt(trendingMoviesQuery.data?.totalResults || '0')
    : parseInt(popularMoviesQuery.data?.totalResults || '0');

  const hasMore = movies.length < totalResults;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        {viewMode !== 'default' || searchTerm ? (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToHome}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftPlaceholder} />
        )}
        
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
      
      {searchTerm || viewMode !== 'default' ? (
        <Text style={styles.sectionTitle}>
          {searchTerm 
            ? 'Search Results'
            : viewMode === 'all-popular'
            ? 'Popular Movies'
            : 'Trending Movies'
          }
        </Text>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Movies</Text>
            <TouchableOpacity onPress={handleSeeAllPopular}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={movies.slice(0, 5)}
            renderItem={({ item }) => (
              <View style={styles.horizontalCardContainer}>
                <MovieCard movie={item} />
              </View>
            )}
            keyExtractor={(item) => `popular-${item.imdbID}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity onPress={handleSeeAllTrending}>
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
          <ActivityIndicator size="large" color="#BB86FC" />
          <Text style={styles.emptyText}>
            Loading movies...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={50} color="#BB86FC" />
          <Text style={styles.emptyText}>
            Something went wrong. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (searchTerm) {
                setPage(1);
                searchQuery.refetch();
              } else if (viewMode === 'all-popular') {
                popularMoviesQuery.refetch();
              } else if (viewMode === 'all-trending') {
                trendingMoviesQuery.refetch();
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
          data={viewMode === 'default' && !searchTerm ? movies.slice(5) : movies}
          renderItem={({ item }) => (
            <View style={styles.gridCardContainer}>
              <MovieCard movie={item} />
            </View>
          )}
          keyExtractor={(item) => item.imdbID}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          onEndReached={hasMore ? handleLoadMore : undefined}
          onEndReachedThreshold={0.5}
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
  headerContainer: {
    padding: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftPlaceholder: {
    width: 40,
    height: 40,
    opacity: 0,
  },
  logo: {
    width: 120,
    height: 40,
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  seeAllText: {
    color: '#BB86FC',
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: 16,
  },
  horizontalCardContainer: {
    marginRight: 16,
    width: CARD_WIDTH,
  },
  gridCardContainer: {
    flex: 1,
    maxWidth: '50%',
    padding: 4,
  },
  gridContent: {
    padding: 12,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  loadMoreButton: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
