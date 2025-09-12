import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Moon, Sun, Type, Globe, Volume2, Database, Info } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';
import ScriptToggle from '@/components/ui/ScriptToggle';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { 
    theme: appTheme, 
    language, 
    fontSize, 
    setTheme, 
    setLanguage, 
    setFontSize 
  } = useAppStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingDetails: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
      color: theme.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
    },
    optionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    optionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    activeOptionButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    optionButtonText: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
      color: theme.text,
    },
    activeOptionButtonText: {
      color: '#ffffff',
    },
    fontSizeControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    fontSizeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    fontSizeValue: {
      minWidth: 40,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
      color: theme.text,
    },
  });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'hi') => {
    setLanguage(newLanguage);
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingSubtitle}>Choose your preferred appearance</Text>
              </View>
            </View>
            <View style={styles.optionButtons}>
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  style={[
                    styles.optionButton,
                    appTheme === themeOption && styles.activeOptionButton,
                  ]}
                  onPress={() => handleThemeChange(themeOption)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      appTheme === themeOption && styles.activeOptionButtonText,
                    ]}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Language & Script */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Script</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Globe size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingSubtitle}>App interface language</Text>
              </View>
            </View>
            <View style={styles.optionButtons}>
              {(['en', 'hi'] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.optionButton,
                    language === lang && styles.activeOptionButton,
                  ]}
                  onPress={() => handleLanguageChange(lang)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      language === lang && styles.activeOptionButtonText,
                    ]}
                  >
                    {lang === 'en' ? 'English' : 'हिंदी'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Type size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Default Script</Text>
                <Text style={styles.settingSubtitle}>Default script for lyrics and ślokas</Text>
              </View>
            </View>
            <ScriptToggle />
          </View>
        </View>

        {/* Reading */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Type size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Font Size</Text>
                <Text style={styles.settingSubtitle}>Adjust text size for better readability</Text>
              </View>
            </View>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={styles.fontSizeButton}
                onPress={() => handleFontSizeChange(-2)}
              >
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold' }}>−</Text>
              </TouchableOpacity>
              <Text style={styles.fontSizeValue}>{fontSize}px</Text>
              <TouchableOpacity
                style={styles.fontSizeButton}
                onPress={() => handleFontSizeChange(2)}
              >
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Database size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Refresh Catalog</Text>
                <Text style={styles.settingSubtitle}>Update songs and ślokas database</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Database size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>Clear Cache</Text>
                <Text style={styles.settingSubtitle}>Free up storage space</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Info size={20} color={theme.text} style={styles.settingIcon} />
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>About & Licenses</Text>
                <Text style={styles.settingSubtitle}>App version and open source licenses</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}