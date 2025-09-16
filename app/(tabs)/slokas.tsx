import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Sloka } from '@/types/database';
import { useAppStore } from '@/store/useAppStore';

interface BookStructure {
  book: string;
  chapters: {
    chapter: number;
    verseCount: number;
  }[];
}

export default function SlokasScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [books, setBooks] = useState<BookStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const { scriptType } = useAppStore();

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
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    bookCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    bookHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    bookTitle: {
      fontSize: 20,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.primary,
    },
    bookStats: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    viewChaptersButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 8,
    },
    viewChaptersText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: '#ffffff',
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      marginBottom: 12,
    },
    instructionText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
    comingSoonBadge: {
      backgroundColor: theme.primary + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    comingSoonText: {
      fontSize: 12,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
      color: theme.primary,
    },
    currentSlokas: {
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    slokaCard: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    slokaSource: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.primary,
      marginBottom: 8,
    },
    slokaText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      lineHeight: 18,
    },
  });

  useEffect(() => {
    loadBooksStructure();
  }, []);

  const loadBooksStructure = async () => {
    try {
      setLoading(true);
      
      // Get all books with their chapter structure
      const booksResult = await db.getAllAsync<{book: string, chapter: number, verseCount: number}>(
        `SELECT book, chapter, COUNT(*) as verseCount 
         FROM slokas 
         GROUP BY book, chapter 
         ORDER BY book, chapter`
      );
      
      // Group by book
      const booksMap = new Map<string, {chapter: number, verseCount: number}[]>();
      
      booksResult.forEach(row => {
        if (!booksMap.has(row.book)) {
          booksMap.set(row.book, []);
        }
        booksMap.get(row.book)!.push({
          chapter: row.chapter,
          verseCount: row.verseCount
        });
      });
      
      const booksStructure: BookStructure[] = Array.from(booksMap.entries()).map(([book, chapters]) => ({
        book,
        chapters: chapters.sort((a, b) => a.chapter - b.chapter)
      }));
      
      setBooks(booksStructure);
    } catch (error) {
      console.error('Error loading books structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: string) => {
    router.push(`/sloka/book/${encodeURIComponent(book)}`);
  };

  // Get current available ślokas for preview
  const [currentSlokas, setCurrentSlokas] = useState<Sloka[]>([]);
  
  useEffect(() => {
    const loadCurrentSlokas = async () => {
      const results = await db.getAllAsync<Sloka>('SELECT * FROM slokas ORDER BY book, chapter, verse LIMIT 5');
      setCurrentSlokas(results);
    };
    loadCurrentSlokas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ślokas</Text>
        <Text style={styles.subtitle}>Browse sacred verses by book and chapter</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructionText}>
          Select a book and chapter to explore the sacred verses. The complete Bhagavad Gītā will be available soon.
        </Text>

        {books.length > 0 ? (
          books.map((bookData) => (
            <TouchableOpacity 
              key={bookData.book} 
              style={styles.bookCard}
              onPress={() => handleBookPress(bookData.book)}
              activeOpacity={0.7}
            >
              <View style={styles.bookHeader}>
                <Text style={styles.bookTitle}>{bookData.book}</Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
              <Text style={styles.bookStats}>
                {bookData.chapters.length} chapters • {bookData.chapters.reduce((sum, ch) => sum + ch.verseCount, 0)} verses
              </Text>
              
              <View style={styles.viewChaptersButton}>
                <Text style={styles.viewChaptersText}>View Chapters</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={theme.textMuted} />
            <Text style={styles.emptyText}>
              No ślokas available yet. The complete Bhagavad Gītā will be added soon.
            </Text>
          </View>
        )}

        {/* Current Available Ślokas Preview */}
        {currentSlokas.length > 0 && (
          <View style={styles.currentSlokas}>
            <Text style={styles.sectionTitle}>Currently Available Ślokas</Text>
            {currentSlokas.map((sloka) => (
              <TouchableOpacity
                key={sloka.id}
                style={styles.slokaCard}
                onPress={() => router.push(`/sloka/${sloka.id}`)}
                activeOpacity={0.7}
              >
                <Text style={styles.slokaSource}>{sloka.source}</Text>
                <Text style={styles.slokaText} numberOfLines={2}>
                  {sloka.translation_en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}