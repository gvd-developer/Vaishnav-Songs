import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Song } from '@/types/database';
import SearchBar from '@/components/ui/SearchBar';
import SongCard from '@/components/ui/SongCard';
import { useAppStore } from '@/store/useAppStore';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SongsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, filters, setFilterModalOpen } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 16,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
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
      paddingBottom: 120,
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
    loadSongs();
  }, [searchQuery, filters]);

  const loadSongs = async () => {
    try {
      setLoading(true);
      let query = 'SELECT DISTINCT s.* FROM songs s';
      const params: any[] = [];
      const conditions: string[] = [];

      // Add joins for filtering
      if (filters.categories.length > 0) {
        query += ' JOIN song_categories sc ON s.id = sc.songId';
      }
      if (filters.tags.length > 0) {
        query += ' JOIN song_tags st ON s.id = st.songId';
      }

      // Search query
      if (searchQuery.trim()) {
        conditions.push('(s.title LIKE ? OR s.composer LIKE ? OR s.lyrics_dev LIKE ? OR s.lyrics_iast LIKE ?)');
        const searchTerm = `%${searchQuery.trim()}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Category filter
      if (filters.categories.length > 0) {
        const placeholders = filters.categories.map(() => '?').join(',');
        conditions.push(`sc.categoryId IN (${placeholders})`);
        params.push(...filters.categories);
      }

      // Tag filter
      if (filters.tags.length > 0) {
        const placeholders = filters.tags.map(() => '?').join(',');
        conditions.push(`st.tagId IN (${placeholders})`);
        params.push(...filters.tags);
      }

      // Composer filter
      if (filters.composers.length > 0) {
        const placeholders = filters.composers.map(() => '?').join(',');
        conditions.push(`s.composer IN (${placeholders})`);
        params.push(...filters.composers);
      }

      // Audio filter
      if (filters.hasAudio === true) {
        conditions.push('s.audio_url IS NOT NULL');
      } else if (filters.hasAudio === false) {
        conditions.push('s.audio_url IS NULL');
      }

      // Raga filter
      if (filters.raga) {
        conditions.push('s.raga LIKE ?');
        params.push(`%${filters.raga}%`);
      }

      // Tala filter
      if (filters.tala) {
        conditions.push('s.tala LIKE ?');
        params.push(`%${filters.tala}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY s.isFeatured DESC, s.createdAt DESC';

      const results = await db.getAllAsync<Song>(query, params);
      setSongs(results);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (song: Song) => {
    router.push(`/song/${song.slug}`);
  };

  const handleFilterPress = () => {
    setFilterModalOpen(true);
  };

  const renderSong = ({ item }: { item: Song }) => (
    <SongCard
      song={item}
      onPress={() => handleSongPress(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No songs found matching your search' : 'No songs available'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Songs</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar placeholder="Search songs, composers..." />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <Filter size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {searchQuery && (
        <Text style={styles.resultsText}>
          {songs.length} result{songs.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
      )}

      <FlatList
        style={styles.content}
        contentContainerStyle={styles.listContent}
        data={songs}
        renderItem={renderSong}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadSongs}
      />

    </SafeAreaView>
  );
}