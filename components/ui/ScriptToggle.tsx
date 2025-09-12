import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';

export default function ScriptToggle() {
  const theme = useTheme();
  const { scriptType, setScriptType } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 2,
    },
    option: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    activeOption: {
      backgroundColor: theme.primary,
    },
    optionText: {
      fontSize: 12,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.textSecondary,
    },
    activeOptionText: {
      color: '#ffffff',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          scriptType === 'devanagari' && styles.activeOption,
        ]}
        onPress={() => setScriptType('devanagari')}
      >
        <Text
          style={[
            styles.optionText,
            scriptType === 'devanagari' && styles.activeOptionText,
          ]}
        >
          देव
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          scriptType === 'iast' && styles.activeOption,
        ]}
        onPress={() => setScriptType('iast')}
      >
        <Text
          style={[
            styles.optionText,
            scriptType === 'iast' && styles.activeOptionText,
          ]}
        >
          IAST
        </Text>
      </TouchableOpacity>
    </View>
  );
}