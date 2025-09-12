import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Filter, Music, Heart, Candy as Candle, Sunrise, Users, Star } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Category, Song } from '@/types/database';
import SearchBar from '@/components/ui/SearchBar';
import SongCard from '@/components/ui/SongCard';
import { useAppStore } from '@/store/useAppStore';

const iconMap = {
  heart: Heart,
  music: Music,
  candle: Candle,
  sunrise: Sunrise,
  users: Users,
  star: Star,
};

export default function CategoryDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    heroSection: {
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    categoryName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    categoryDescription: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
    },
    searchSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchContainer: {
      flex: 1,
      marginRight: 12,
    },
    filterButton: {
      backgroundColor: theme.surface,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    content: {
      flex: 1,
    },
    list: {
      paddingHorizontal: 20,
    },
    listContent: {
      paddingBottom: 100,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    statsText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
    resultsText: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      fontSize: 14,
      color: theme.textSecondary,
    },
  });

  useEffect(() => {
    if (slug) {
      loadCategoryData();
    }
  }, [slug, searchQuery]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Load category
      const categoryResult = await db.getFirstAsync<Category>(
        'SELECT * FROM categories WHERE slug = ?',
        [slug]
      );
      
      if (categoryResult) {
        setCategory(categoryResult);
        
        // Load songs in this category
        let query = `
          SELECT DISTINCT s.* 
          FROM songs s 
          JOIN song_categories sc ON s.id = sc.songId 
          WHERE sc.categoryId = ?
        `;
        const params: any[] = [categoryResult.id];

        // Add search filter if present
        if (searchQuery.trim()) {
          query += ' AND (s.title LIKE ? OR s.composer LIKE ? OR s.lyrics_dev LIKE ? OR s.lyrics_iast LIKE ?)';
          const searchTerm = `%${searchQuery.trim()}%`;
          params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY s.isFeatured DESC, s.title ASC';

        const songsResult = await db.getAllAsync<Song>(query, params);
        setSongs(songsResult);
      }
    } catch (error) {
      console.error('Error loading category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (song: Song) => {
    router.push(`/song/${song.slug}`);
  };

  const renderSong = ({ item }: { item: Song }) => (
    <SongCard
      song={item}
      onPress={() => handleSongPress(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Music size={48} color={theme.textMuted} />
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'No songs found matching your search in this category' 
          : 'No songs available in this category'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, color: theme.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, color: theme.text }}>Category not found</Text>
      </SafeAreaView>
    );
  }

  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Music;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {category.name}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <IconComponent size={40} color={theme.primary} />
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
        {category.description && (
          <Text style={styles.categoryDescription}>{category.description}</Text>
        )}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {songs.length} song{songs.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar placeholder={`Search in ${category.name}...`} />
          </View>
        </View>
      </View>

      {searchQuery && (
        <Text style={styles.resultsText}>
          {songs.length} result{songs.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
      )}

      {/* Songs List */}
      <FlatList
        style={styles.content}
        contentContainerStyle={styles.listContent}
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadCategoryData}
      />
    </SafeAreaView>
  );
}