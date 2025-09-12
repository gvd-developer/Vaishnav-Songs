import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Sloka } from '@/types/database';
import SearchBar from '@/components/ui/SearchBar';
import ScriptToggle from '@/components/ui/ScriptToggle';
import { useAppStore } from '@/store/useAppStore';

export default function SlokasScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [slokas, setSlokas] = useState<Sloka[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, scriptType } = useAppStore();

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
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    searchContainer: {
      flex: 1,
      marginRight: 12,
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
    sourceText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 12,
    },
    slokaText: {
      fontSize: 16,
      lineHeight: 24,
      color: scriptType === 'devanagari' ? theme.devanagari : theme.iast,
      marginBottom: 12,
      fontFamily: scriptType === 'devanagari' ? 'DevanagariFont' : 'IastFont',
    },
    translationText: {
      fontSize: 14,
      lineHeight: 20,
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
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  useEffect(() => {
    loadSlokas();
  }, [searchQuery]);

  const loadSlokas = async () => {
    try {
      setLoading(true);
      let query = 'SELECT * FROM slokas';
      const params: any[] = [];

      if (searchQuery.trim()) {
        query += ' WHERE source LIKE ? OR text_dev LIKE ? OR text_iast LIKE ? OR translation_en LIKE ?';
        const searchTerm = `%${searchQuery.trim()}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY source';

      const results = await db.getAllAsync<Sloka>(query, params);
      setSlokas(results);
    } catch (error) {
      console.error('Error loading slokas:', error);
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
      <Text style={styles.sourceText}>{item.source}</Text>
      <Text style={styles.slokaText}>
        {scriptType === 'devanagari' ? item.text_dev : item.text_iast}
      </Text>
      <Text style={styles.translationText} numberOfLines={2}>
        {item.translation_en}
      </Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <BookOpen size={48} color={theme.textMuted} />
      <Text style={styles.emptyText}>
        {searchQuery ? 'No ślokas found matching your search' : 'No ślokas available'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ślokas</Text>
        <View style={styles.controls}>
          <View style={styles.searchContainer}>
            <SearchBar placeholder="Search ślokas, sources..." />
          </View>
          <ScriptToggle />
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={slokas}
        renderItem={renderSloka}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadSlokas}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}