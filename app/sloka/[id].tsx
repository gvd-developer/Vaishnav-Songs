import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, BookOpen, Share, Music } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Sloka, Song } from '@/types/database';
import ScriptToggle from '@/components/ui/ScriptToggle';
import SongCard from '@/components/ui/SongCard';
import { useAppStore } from '@/store/useAppStore';

export default function SlokaDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sloka, setSloka] = useState<Sloka | null>(null);
  const [referencedSongs, setReferencedSongs] = useState<(Song & { relationNote?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { scriptType, fontSize, language } = useAppStore();

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
    actions: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    content: {
      flex: 1,
    },
    heroSection: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sourceText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
    slokaContainer: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    slokaText: {
      fontSize: fontSize + 2,
      lineHeight: (fontSize + 2) * 1.6,
      color: scriptType === 'devanagari' ? theme.devanagari : theme.iast,
      textAlign: 'center',
      marginBottom: 16,
    },
    translationSection: {
      marginTop: 20,
    },
    translationText: {
      fontSize: fontSize,
      lineHeight: fontSize * 1.5,
      color: theme.text,
      marginBottom: 12,
    },
    translationLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    themeTagsSection: {
      marginTop: 20,
    },
    themeTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    themeTag: {
      backgroundColor: theme.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    themeTagText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.primary,
    },
    songsSection: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    songsList: {
      marginTop: 16,
    },
    relationNote: {
      fontSize: 12,
      color: theme.textMuted,
      fontStyle: 'italic',
      marginTop: 8,
      paddingHorizontal: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  useEffect(() => {
    if (id) {
      loadSlokaData();
    }
  }, [id]);

  const loadSlokaData = async () => {
    try {
      setLoading(true);
      
      // Load sloka
      const slokaResult = await db.getFirstAsync<Sloka>(
        'SELECT * FROM slokas WHERE id = ?',
        [id]
      );
      
      if (slokaResult) {
        setSloka(slokaResult);
        
        // Load referenced songs
        const songsResult = await db.getAllAsync<Song & { relationNote?: string }>(
          `SELECT s.*, ss.relationNote 
           FROM songs s 
           JOIN song_slokas ss ON s.id = ss.songId 
           WHERE ss.slokaId = ?
           ORDER BY s.title`,
          [slokaResult.id]
        );
        
        setReferencedSongs(songsResult);
      }
    } catch (error) {
      console.error('Error loading sloka data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (song: Song) => {
    router.push(`/song/${song.slug}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, color: theme.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!sloka) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, color: theme.text }}>Śloka not found</Text>
      </SafeAreaView>
    );
  }

  const themeTags = JSON.parse(sloka.themeTags || '[]');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {sloka.source}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.sourceText}>{sloka.source}</Text>
          
          <View style={styles.slokaContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {scriptType === 'devanagari' ? 'Sanskrit' : 'IAST'}
              </Text>
              <ScriptToggle />
            </View>
            
            <Text style={styles.slokaText}>
              {scriptType === 'devanagari' ? sloka.text_dev : sloka.text_iast}
            </Text>
          </View>

          {/* Translations */}
          <View style={styles.translationSection}>
            <Text style={styles.translationLabel}>English Translation</Text>
            <Text style={styles.translationText}>{sloka.translation_en}</Text>
            
            {sloka.translation_hi && (
              <>
                <Text style={styles.translationLabel}>हिंदी अनुवाद</Text>
                <Text style={styles.translationText}>{sloka.translation_hi}</Text>
              </>
            )}
          </View>

          {/* Theme Tags */}
          {themeTags.length > 0 && (
            <View style={styles.themeTagsSection}>
              <Text style={styles.translationLabel}>Themes</Text>
              <View style={styles.themeTagsContainer}>
                {themeTags.map((tag: string, index: number) => (
                  <View key={index} style={styles.themeTag}>
                    <Text style={styles.themeTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Referenced Songs */}
        {referencedSongs.length > 0 && (
          <View style={styles.songsSection}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Music size={20} color={theme.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Referenced in Songs</Text>
              </View>
            </View>
            
            <View style={styles.songsList}>
              {referencedSongs.map((song) => (
                <View key={song.id}>
                  <SongCard
                    song={song}
                    onPress={() => handleSongPress(song)}
                  />
                  {song.relationNote && (
                    <Text style={styles.relationNote}>— {song.relationNote}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {referencedSongs.length === 0 && (
          <View style={styles.emptyState}>
            <Music size={48} color={theme.textMuted} />
            <Text style={styles.emptyText}>
              This śloka is not yet referenced in any songs
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}