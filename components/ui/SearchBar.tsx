import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';

interface SearchBarProps {
  placeholder?: string;
  onFocus?: () => void;
}

export default function SearchBar({ placeholder = 'Search songs...', onFocus }: SearchBarProps) {
  const theme = useTheme();
  const { searchQuery, setSearchQuery } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.text,
      marginLeft: 12,
    },
    icon: {
      opacity: 0.6,
    },
  });

  return (
    <View style={styles.container}>
      <Search size={20} color={theme.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={onFocus}
      />
    </View>
  );
}