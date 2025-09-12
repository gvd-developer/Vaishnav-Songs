import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/theme';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const theme = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    imageContainer: {
      flex: 1,
      position: 'relative',
    },
    backgroundImage: {
      width: width,
      height: height,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    appTitle: {
      fontSize: 32,
      fontWeight: '700',
      fontFamily: theme.fonts.decorative,
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    appSubtitle: {
      fontSize: 18,
      fontFamily: theme.fonts.medium,
      color: '#ffffff',
      textAlign: 'center',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    sanskritText: {
      fontSize: 24,
      fontFamily: theme.fonts.decorative,
      color: '#ffffff',
      textAlign: 'center',
      marginTop: 20,
      fontStyle: 'italic',
      opacity: 0.8,
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    bottomContent: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: '#ffffff',
      opacity: 0.7,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    dots: {
      flexDirection: 'row',
      marginTop: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ffffff',
      marginHorizontal: 4,
      opacity: 0.6,
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/3194521/pexels-photo-3194521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
          style={styles.overlay}
        />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.appTitle}>Vaishnav Songs</Text>
            <Text style={styles.appSubtitle}>Sacred Melodies & Wisdom</Text>
            <Text style={styles.sanskritText}>हरे कृष्ण हरे राम</Text>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.loadingText}>Loading spiritual content...</Text>
          <View style={styles.dots}>
            <View style={[styles.dot, { opacity: 0.8 }]} />
            <View style={[styles.dot, { opacity: 0.6 }]} />
            <View style={[styles.dot, { opacity: 0.4 }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}