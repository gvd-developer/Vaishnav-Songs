import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Sloka } from '@/types/database';
import ScriptToggle from '@/components/ui/ScriptToggle';
import { useAppStore } from '@/store/useAppStore';

export default function ChapterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>();
  const [slokas, setSlokas] = useState<Sloka[]>([]);
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
    bookTitle: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: theme.fonts.bold,
      color: theme.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    chapterTitle: {
      fontSize: 20,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    verseCount: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    list: {
      flex: 1,
      paddingHorizontal: 20,
    },
    slokaCard: {
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
    verseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    verseNumber: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.primary,
    },
    sourceText: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.textMuted,
    },
    slokaText: {
      fontSize: fontSize + 2,
      lineHeight: (fontSize + 2) * 1.6,
      color: scriptType === 'devanagari' ? theme.devanagari : theme.iast,
      marginBottom: 12,
      textAlign: 'center',
    },
    translationText: {
      fontSize: fontSize,
      lineHeight: fontSize * 1.5,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      fontStyle: 'italic',
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
    if (book && chapter) {
      loadChapterSlokas();
    }
  }, [book, chapter]);

  const loadChapterSlokas = async () => {
    try {
      setLoading(true);
      const bookSlug = book as string;
      const chapterNum = parseInt(chapter as string);
      
      // First get book details
      const bookResult = await db.getFirstAsync<any>(
        'SELECT * FROM books WHERE slug = ?',
        [bookSlug]
      );
      
      if (!bookResult) return;
      
      const results = await db.getAllAsync<Sloka>(
        'SELECT * FROM slokas WHERE bookId = ? AND chapter = ? ORDER BY verse',
        [bookResult.id, chapterNum]
      );
      
      setSlokas(results);
    } catch (error) {
      console.error('Error loading chapter slokas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlokaPress = (sloka: Sloka) => {
    router.push(`/sloka/${sloka.id}`);
  };

  const renderSloka = ({ item }: { item: Sloka }) => (
    <TouchableOpacity 
      style={styles.slokaCard} 
      onPress={() => handleSlokaPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.verseHeader}>
        <Text style={styles.verseNumber}>Verse {item.verse}</Text>
        <Text style={styles.sourceText}>{item.source}</Text>
      </View>
      
      <Text style={styles.slokaText}>
        {scriptType === 'devanagari' ? item.text_dev : item.text_iast}
      </Text>
      
      <Text style={styles.translationText} numberOfLines={3}>
        {item.translation_en}
      </Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <BookOpen size={48} color={theme.textMuted} />
      <Text style={styles.emptyText}>
        No verses available in this chapter yet.{'\n'}
        The complete Bhagavad Gītā will be added soon.
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

  const decodedBook = decodeURIComponent(book as string);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chapter {chapter}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.bookTitle}>{decodedBook}</Text>
        <Text style={styles.chapterTitle}>Chapter {chapter}</Text>
      </View>

      <View style={styles.controls}>
        <Text style={styles.verseCount}>
          {slokas.length} verse{slokas.length !== 1 ? 's' : ''}
        </Text>
        <ScriptToggle />
      </View>

      <FlatList
        style={styles.list}
        data={slokas}
        renderItem={renderSloka}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadChapterSlokas}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}