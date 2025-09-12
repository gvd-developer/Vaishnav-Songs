import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Grid3x3, Music, Heart, Candy as Candle, Sunrise, Users, Star } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { db } from '@/lib/database';
import { Category } from '@/types/database';

const iconMap = {
  heart: Heart,
  music: Music,
  candle: Candle,
  sunrise: Sunrise,
  users: Users,
  star: Star,
};

export default function CategoriesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
    list: {
      flex: 1,
      paddingHorizontal: 20,
    },
    categoryCard: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    content: {
      flex: 1,
    },
    categoryName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    categoryDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 18,
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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const results = await db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name');
      setCategories(results);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.slug}`);
  };

  const renderCategory = ({ item }: { item: Category }) => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Music;
    
    return (
      <TouchableOpacity 
        style={styles.categoryCard} 
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <IconComponent size={28} color={theme.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.categoryName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.categoryDescription}>{item.description}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Grid3x3 size={48} color={theme.textMuted} />
      <Text style={styles.emptyText}>No categories available</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse songs by type and mood</Text>
      </View>

      <FlatList
        style={styles.list}
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadCategories}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}