import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewScreenProps {
  url: string;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url }) => {
  const baseUrl = process.env.MOBILE_WEBVIEW_URL || 'https://your-shopping-mall.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: fullUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;

