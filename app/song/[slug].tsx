import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Heart, Share, Music, Volume2 } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Song, Sloka } from '@/types/database';
import ScriptToggle from '@/components/ui/ScriptToggle';
import { useAppStore } from '@/store/useAppStore';

export default function SongDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [attachedSlokas, setAttachedSlokas] = useState<(Sloka & { relationNote?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { scriptType, fontSize } = useAppStore();

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
    coverImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    titleSection: {
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    composer: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 20,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 14,
      color: theme.textMuted,
      marginLeft: 4,
    },
    audioControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    playButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    lyricsSection: {
      padding: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
    },
    lyricsText: {
      fontSize: fontSize,
      lineHeight: fontSize * 1.6,
      color: scriptType === 'devanagari' ? theme.devanagari : theme.iast,
      marginBottom: 20,
    },
    slokasSection: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    slokaCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    slokaSource: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 8,
    },
    slokaText: {
      fontSize: 14,
      lineHeight: 20,
      color: scriptType === 'devanagari' ? theme.devanagari : theme.iast,
      marginBottom: 8,
    },
    slokaTranslation: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.textSecondary,
      fontStyle: 'italic',
    },
    relationNote: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 8,
      fontStyle: 'italic',
    },
  });

  useEffect(() => {
    if (slug) {
      loadSongData();
    }
  }, [slug]);

  const loadSongData = async () => {
    try {
      setLoading(true);
      
      // Load song
      const songResult = await db.getFirstAsync<Song>(
        'SELECT * FROM songs WHERE slug = ?',
        [slug]
      );
      
      if (songResult) {
        setSong(songResult);
        
        // Load attached slokas
        const slokasResult = await db.getAllAsync<Sloka & { relationNote?: string }>(
          `SELECT s.*, ss.relationNote 
           FROM slokas s 
           JOIN song_slokas ss ON s.id = ss.slokaId 
           WHERE ss.songId = ?`,
          [songResult.id]
        );
        
        setAttachedSlokas(slokasResult);
      }
    } catch (error) {
      console.error('Error loading song data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, color: theme.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!song) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, color: theme.text }}>Song not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {song.title}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {song.cover_url && (
            <Image source={{ uri: song.cover_url }} style={styles.coverImage} />
          )}
          
          <View style={styles.titleSection}>
            <Text style={styles.title}>{song.title}</Text>
            <Text style={styles.composer}>{song.composer}</Text>
            
            {(song.era || song.raga || song.tala) && (
              <View style={styles.meta}>
                {song.era && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>{song.era}</Text>
                  </View>
                )}
                {song.raga && (
                  <View style={styles.metaItem}>
                    <Music size={14} color={theme.textMuted} />
                    <Text style={styles.metaText}>Rāga: {song.raga}</Text>
                  </View>
                )}
                {song.tala && (
                  <View style={styles.metaItem}>
                    <Volume2 size={14} color={theme.textMuted} />
                    <Text style={styles.metaText}>Tāla: {song.tala}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Lyrics */}
        <View style={styles.lyricsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lyrics</Text>
            <ScriptToggle />
          </View>
          
          <Text style={styles.lyricsText}>
            {scriptType === 'devanagari' ? song.lyrics_dev : song.lyrics_iast}
          </Text>
        </View>

        {/* Attached Slokas */}
        {attachedSlokas.length > 0 && (
          <View style={styles.slokasSection}>
            <Text style={styles.sectionTitle}>Related Ślokas</Text>
            
            {attachedSlokas.map((sloka) => (
              <View key={sloka.id} style={styles.slokaCard}>
                <Text style={styles.slokaSource}>{sloka.source}</Text>
                <Text style={styles.slokaText}>
                  {scriptType === 'devanagari' ? sloka.text_dev : sloka.text_iast}
                </Text>
                <Text style={styles.slokaTranslation}>{sloka.translation_en}</Text>
                {sloka.relationNote && (
                  <Text style={styles.relationNote}>— {sloka.relationNote}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}