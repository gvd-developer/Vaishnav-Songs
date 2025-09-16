import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, Star, Clock } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Book, Sloka } from '@/types/database';

export default function SlokasScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
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
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
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
      fontSize: 20,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    sectionIcon: {
      marginRight: 8,
    },
    booksList: {
      paddingHorizontal: 20,
    },
    bookCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    bookHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    bookTitleContainer: {
      flex: 1,
    },
    bookTitle: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    bookSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.primary,
      fontStyle: 'italic',
    },
    bookDescription: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    bookMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    bookMetaItem: {
      alignItems: 'center',
    },
    bookMetaNumber: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: theme.fonts.bold,
      color: theme.primary,
    },
    bookMetaLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      marginTop: 2,
    },
    statusBadge: {
      backgroundColor: theme.warning + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-end',
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
      color: theme.warning,
    },
    viewButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewButtonText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: '#ffffff',
      marginRight: 8,
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
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const results = await db.getAllAsync<Book>(
        'SELECT * FROM books ORDER BY createdAt'
      );
      setBooks(results);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: Book) => {
    router.push(`/sloka/book/${book.slug}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ślokas</Text>
        <Text style={styles.subtitle}>Sacred scriptures and wisdom</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={20} color={theme.primary} style={styles.sectionIcon} />
            <Text style={[styles.sectionHeader, { paddingHorizontal: 0, paddingBottom: 0 }]}>
              Sacred Scriptures
            </Text>
          </View>
          
          <View style={styles.booksList}>
            {books.map((book) => (
              <View key={book.id} style={styles.bookCard}>
                <View style={styles.bookHeader}>
                  <View style={styles.bookTitleContainer}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    {book.subtitle && (
                      <Text style={styles.bookSubtitle}>{book.subtitle}</Text>
                    )}
                  </View>
                  <BookOpen size={28} color={theme.primary} />
                </View>
                
                {book.description && (
                  <Text style={styles.bookDescription} numberOfLines={3}>
                    {book.description}
                  </Text>
                )}
                
                <View style={styles.bookMeta}>
                  <View style={styles.bookMetaItem}>
                    <Text style={styles.bookMetaNumber}>{book.totalChapters}</Text>
                    <Text style={styles.bookMetaLabel}>Chapters</Text>
                  </View>
                  <View style={styles.bookMetaItem}>
                    <Text style={styles.bookMetaNumber}>{book.totalVerses}</Text>
                    <Text style={styles.bookMetaLabel}>Verses</Text>
                  </View>
                  <View style={styles.bookMetaItem}>
                    <Text style={styles.bookMetaNumber}>{book.author}</Text>
                    <Text style={styles.bookMetaLabel}>Author</Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handleBookPress(book)}
                  >
                    <Text style={styles.viewButtonText}>View Chapters</Text>
                    <ChevronRight size={16} color="#ffffff" />
                  </TouchableOpacity>
                  
                  {!book.isComplete && (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>In Progress</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {books.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={theme.textMuted} />
            <Text style={styles.emptyText}>No sacred texts available yet</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}