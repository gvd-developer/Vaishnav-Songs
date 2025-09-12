import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Star, TrendingUp, Clock, Music } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Song, Category } from '@/types/database';
import SearchBar from '@/components/ui/SearchBar';
import SongCard from '@/components/ui/SongCard';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    greeting: {
      fontSize: 28,
      fontWeight: '700',
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      marginBottom: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
    sectionAction: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.primary,
      fontWeight: '500',
    },
    categoryChips: {
      paddingHorizontal: 20,
    },
    categoryChip: {
      backgroundColor: theme.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryChipText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      fontWeight: '500',
    },
    songList: {
      paddingHorizontal: 20,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      marginTop: 12,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load featured songs
      const featured = await db.getAllAsync<Song>(
        'SELECT * FROM songs WHERE isFeatured = 1 ORDER BY createdAt DESC LIMIT 5'
      );
      setFeaturedSongs(featured);

      // Load recent songs
      const recent = await db.getAllAsync<Song>(
        'SELECT * FROM songs ORDER BY createdAt DESC LIMIT 10'
      );
      setRecentSongs(recent);

      // Load categories
      const cats = await db.getAllAsync<Category>(
        'SELECT * FROM categories ORDER BY name'
      );
      setCategories(cats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSongPress = (song: Song) => {
    router.push(`/song/${song.slug}`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.slug}`);
  };

  const handleSeeAll = (section: string) => {
    router.push('/songs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Namaste</Text>
          <Text style={styles.subtitle}>Discover beautiful Vaishnav songs</Text>
          <SearchBar onFocus={() => router.push('/songs')} />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChips}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryChip}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryChipText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Songs */}
        {featuredSongs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star size={20} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Featured</Text>
              </View>
              <TouchableOpacity onPress={() => handleSeeAll('featured')}>
                <Text style={styles.sectionAction}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.songList}>
              {featuredSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onPress={() => handleSongPress(song)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Recent Songs */}
        {recentSongs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Clock size={20} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Recently Added</Text>
              </View>
              <TouchableOpacity onPress={() => handleSeeAll('recent')}>
                <Text style={styles.sectionAction}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.songList}>
              {recentSongs.slice(0, 3).map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onPress={() => handleSongPress(song)}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}