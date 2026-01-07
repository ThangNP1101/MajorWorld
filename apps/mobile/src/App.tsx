import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { fetchAppConfig } from './services/api';
import { AppConfig } from './types';
import WebViewScreen from './screens/WebViewScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Fetch app configuration from backend
      const appConfig = await fetchAppConfig();
      setConfig(appConfig);

      // Hide splash screen after configured duration
      setTimeout(() => {
        SplashScreen.hide();
        setLoading(false);
      }, (appConfig.splash.duration || 2) * 1000);
    } catch (error) {
      console.error('Failed to fetch app config:', error);
      SplashScreen.hide();
      setLoading(false);
    }
  };

  if (loading || !config) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9f7575" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: config.theme.tapMenuBg,
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        }}
      >
        {config.menus.map((menu) => (
          <Tab.Screen
            key={menu.id}
            name={menu.name}
            children={() => <WebViewScreen url={menu.url} />}
            options={{
              headerShown: false,
              tabBarLabel: menu.name,
              tabBarIcon: ({ focused }) => {
                // focused = true when this tab is currently displayed (active)
                // focused = false when this tab is not displayed (inactive)
                const iconUrl = focused ? menu.iconActive : menu.iconInactive;
                
                if (iconUrl) {
                  return (
                    <Image
                      source={{ uri: iconUrl }}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                  );
                }
                
                // Fallback if no icon is uploaded
                return null;
              },
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

