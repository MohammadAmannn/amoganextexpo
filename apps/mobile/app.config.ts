export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME ?? 'Amoga',
    slug: 'amoga',
    scheme: 'amoga',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    experiments: { typedRoutes: true },
    plugins: ['expo-router'],
    ios: { supportsTablet: true, bundleIdentifier: 'com.amoga.app' },
    android: { package: 'com.amoga.app', adaptiveIcon: { backgroundColor: '#ffffff' } },
    extra: { eas: { projectId: process.env.EAS_PROJECT_ID } },
  },
}
