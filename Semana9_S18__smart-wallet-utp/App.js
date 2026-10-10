import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DashboardScreen from './src/DashboardScreen';
import MovementsScreen from './src/MovementsScreen';
import SettingsScreen from './src/SettingsScreen';
import { getTheme } from './src/FinanceStorage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadAppTheme = async () => {
      const storedTheme = await getTheme();
      setTheme(storedTheme);
    };
    loadAppTheme();
  },
   []);

  const isDark = theme === 'dark';
  const themeStyle = isDark ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyle.container]}>
      <View style={[styles.nav, themeStyle.nav]}>
        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'dashboard' ? themeStyle.activeNav : themeStyle.inactiveNav]}
          onPress={() => setCurrentTab('dashboard')}
        >
          <Text style={[styles.navText, currentTab === 'dashboard' ? themeStyle.activeNavText : themeStyle.inactiveNavText]}>DASHBOARD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'movements' ? themeStyle.activeNav : themeStyle.inactiveNav]}
          onPress={() => setCurrentTab('movements')}
        >
          <Text style={[styles.navText, currentTab === 'movements' ? themeStyle.activeNavText : themeStyle.inactiveNavText]}>MOVIMIENTOS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'settings' ? themeStyle.activeNav : themeStyle.inactiveNav]}
          onPress={() => setCurrentTab('settings')}
        >
          <Text style={[styles.navText, currentTab === 'settings' ? themeStyle.activeNavText : themeStyle.inactiveNavText]}>CONFIG</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {currentTab === 'dashboard' && <DashboardScreen />}
        {currentTab === 'movements' && <MovementsScreen />}
        {currentTab === 'settings' && <SettingsScreen onThemeChange={setTheme} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 0,
  },

  nav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRadius: 0,
  },

  navBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRadius: 0,
  },

  navText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  content: {
    flex: 1,
  },

});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },

  nav: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#000000',
  },

  activeNav: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },

  inactiveNav: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },

  activeNavText: {
    color: '#FFFFFF',
  },

  inactiveNavText: {
    color: '#000000',
  },

});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },

  nav: {
    backgroundColor: '#000000',
    borderBottomColor: '#FFFFFF',
  },

  activeNav: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },

  inactiveNav: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
  },

  activeNavText: {
    color: '#000000',
  },

  inactiveNavText: {
    color: '#FFFFFF',
  },

});