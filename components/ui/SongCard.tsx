import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Music } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { Song } from '@/types/database';
import { useAppStore } from '@/store/useAppStore';

interface SongCardProps {
  song: Song;
  onPress: () => void;
}

export default function SongCard({ song, onPress }: SongCardProps) {
  const theme = useTheme();
  const { scriptType } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      marginBottom: 4,
    },
    composer: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      marginLeft: 12,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    metaText: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.textMuted,
      marginLeft: 4,
    },
    coverImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contentText: {
      flex: 1,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.contentRow}>
        {song.cover_url && (
          <Image source={{ uri: song.cover_url }} style={styles.coverImage} />
        )}
        <View style={styles.contentText}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{song.title}</Text>
              <Text style={styles.composer}>{song.composer}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {(song.raga || song.tala) && (
            <View style={styles.meta}>
              {song.raga && (
                <View style={styles.metaItem}>
                  <Music size={12} color={theme.textMuted} />
                  <Text style={styles.metaText}>Rāga: {song.raga}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}