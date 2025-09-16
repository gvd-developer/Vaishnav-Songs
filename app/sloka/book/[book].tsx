import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';

interface ChapterInfo {
  chapter: number;
  verseCount: number;
}

export default function BookDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { book } = useLocalSearchParams<{ book: string }>();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);

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
      fontFamily: theme.fonts.semiBold,
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
    bookIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    bookTitle: {
      fontSize: 28,
      fontWeight: '700',
      fontFamily: theme.fonts.bold,
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    bookSubtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    content: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    chaptersList: {
      paddingHorizontal: 20,
    },
    chapterCard: {
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chapterInfo: {
      flex: 1,
    },
    chapterTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      marginBottom: 4,
    },
    chapterMeta: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    chapterArrow: {
      marginLeft: 12,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
    comingSoonBadge: {
      backgroundColor: theme.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 8,
    },
    comingSoonText: {
      fontSize: 12,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
      color: theme.primary,
    },
  });

  useEffect(() => {
    if (book) {
      loadChapters();
    }
  }, [book]);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const decodedBook = decodeURIComponent(book as string);
      
      const results = await db.getAllAsync<ChapterInfo>(
        `SELECT chapter, COUNT(*) as verseCount 
         FROM slokas 
         WHERE book = ? 
         GROUP BY chapter 
         ORDER BY chapter`,
        [decodedBook]
      );
      
      setChapters(results);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterPress = (chapterNumber: number) => {
    router.push(`/sloka/book/${encodeURIComponent(book as string)}/chapter/${chapterNumber}`);
  };

  const decodedBook = book ? decodeURIComponent(book as string) : '';
  const totalVerses = chapters.reduce((sum, ch) => sum + ch.verseCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {decodedBook}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.bookIcon}>
            <BookOpen size={40} color={theme.primary} />
          </View>
          <Text style={styles.bookTitle}>{decodedBook}</Text>
          <Text style={styles.bookSubtitle}>Sacred Dialogue of Spiritual Wisdom</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {chapters.length} chapters • {totalVerses} verses
            </Text>
          </View>
          {chapters.length === 0 && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Complete text coming soon</Text>
            </View>
          )}
        </View>

        {/* Chapters List */}
        <Text style={styles.sectionTitle}>Chapters</Text>
        
        <View style={styles.chaptersList}>
          {chapters.length > 0 ? (
            chapters.map((chapterInfo) => (
              <TouchableOpacity
                key={chapterInfo.chapter}
                style={styles.chapterCard}
                onPress={() => handleChapterPress(chapterInfo.chapter)}
                activeOpacity={0.7}
              >
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>
                    Chapter {chapterInfo.chapter}
                  </Text>
                  <Text style={styles.chapterMeta}>
                    {chapterInfo.verseCount} verse{chapterInfo.verseCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                <ChevronRight size={20} color={theme.textMuted} style={styles.chapterArrow} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <BookOpen size={48} color={theme.textMuted} />
              <Text style={styles.emptyText}>
                Chapters will be available soon.{'\n'}
                The complete {decodedBook} is being prepared.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}