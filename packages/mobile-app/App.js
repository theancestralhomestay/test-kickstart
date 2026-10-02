import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Platform, BackHandler, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import * as Network from 'expo-network';

export default function App() {
  const webviewRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  const IS_UAT = Constants.expoConfig.extra?.env === 'uat';
  // Point to the Firebase Hosting domain
  const BASE_URL = `https://test-kickstart.web.app/${IS_UAT ? '?env=uat' : ''}`;

  useEffect(() => {
    checkNetwork();
    const backAction = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  const checkNetwork = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={IS_UAT ? 'light-content' : 'dark-content'} backgroundColor={IS_UAT ? '#ea580c' : '#ffffff'} />
      <WebView
        ref={webviewRef}
        source={{ uri: BASE_URL }}
        style={styles.webview}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        startInLoadingState={true}
        renderLoading={() => <View style={[StyleSheet.absoluteFill, styles.center]}><ActivityIndicator size="large" color="#10b981" /></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  webview: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
