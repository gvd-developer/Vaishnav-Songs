import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, Clock, Download, List, Settings, User } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Song } from '@/types/database';
import SongCard from '@/components/ui/SongCard';

export default function LibraryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [favouriteSongs, setFavouriteSongs] = useState<Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

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
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 12,
    },
    songList: {
      paddingHorizontal: 20,
    },
    menuSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
      flex: 1,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load favourite songs (mock data for now)
      const favourites = await db.getAllAsync<Song>(
        'SELECT * FROM songs ORDER BY RANDOM() LIMIT 3'
      );
      setFavouriteSongs(favourites);

      // Load recent songs
      const recent = await db.getAllAsync<Song>(
        'SELECT * FROM songs ORDER BY createdAt DESC LIMIT 5'
      );
      setRecentSongs(recent);
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (song: Song) => {
    router.push(`/song/${song.slug}`);
  };

  const handleMenuPress = (screen: string) => {
    if (screen === 'settings') {
      router.push('/settings');
    }
    // Add other menu navigation as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
          <Text style={styles.subtitle}>Your personal collection</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuPress('settings')}
          >
            <Settings size={24} color={theme.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Download size={24} color={theme.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>Downloaded Songs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <List size={24} color={theme.primary} style={styles.menuIcon} />
            <Text style={styles.menuText}>My Playlists</Text>
          </TouchableOpacity>
        </View>

        {/* Favourites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>Favourites</Text>
          </View>
          <View style={styles.songList}>
            {favouriteSongs.length > 0 ? (
              favouriteSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onPress={() => handleSongPress(song)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Heart size={48} color={theme.textMuted} />
                <Text style={styles.emptyText}>
                  No favourite songs yet.{'\n'}Tap the heart icon on any song to add it here.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Recently Played */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>Recently Played</Text>
          </View>
          <View style={styles.songList}>
            {recentSongs.length > 0 ? (
              recentSongs.slice(0, 3).map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onPress={() => handleSongPress(song)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Clock size={48} color={theme.textMuted} />
                <Text style={styles.emptyText}>
                  No recently played songs
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}