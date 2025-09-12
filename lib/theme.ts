import { useColorScheme } from 'react-native';
import { useAppStore } from '@/store/useAppStore';

export const fonts = {
  regular: 'BeVietnamPro-Regular',
  medium: 'BeVietnamPro-Medium',
  semiBold: 'BeVietnamPro-SemiBold',
  bold: 'BeVietnamPro-Bold',
  decorative: 'BaskervvilleSC-Regular',
};

export const lightTheme = {
  background: '#ffffff',
  surface: '#f8f9fa',
  card: '#ffffff',
  primary: '#ff6b35',
  primaryLight: '#ff8c5c',
  secondary: '#4a90e2',
  accent: '#f39c12',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  textMuted: '#bdc3c7',
  border: '#e9ecef',
  shadow: '#000000',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  devanagari: '#8b4513',
  iast: '#2c3e50',
  fonts,
};

export const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  card: '#2a2a2a',
  primary: '#ff6b35',
  primaryLight: '#ff8c5c',
  secondary: '#64b5f6',
  accent: '#ffa726',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  textMuted: '#666666',
  border: '#333333',
  shadow: '#000000',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  devanagari: '#deb887',
  iast: '#e0e0e0',
  fonts,
};

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { theme } = useAppStore();
  
  const activeTheme = theme === 'system' ? systemColorScheme : theme;
  
  return activeTheme === 'dark' ? darkTheme : lightTheme;
}