import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getBudget, saveBudget, getTheme, saveTheme } from './FinanceStorage';

export default function SettingsScreen({ onThemeChange }) {
  const [budgetInput, setBudgetInput] = useState('');
  const [currentBudget, setCurrentBudget] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const load = async () => {
      const b = await getBudget();
      const t = await getTheme();
      setCurrentBudget(b);
      setBudgetInput(b.toString());
      setTheme(t);
    };
    load();
  },
   []);

  const isDark = theme === 'dark';
  const themeStyle = isDark ? darkStyles : lightStyles;

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val >= 0) {
      setCurrentBudget(val);
      await saveBudget(val);
    }
  };

  const handleToggleTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    await saveTheme(nextTheme);
    if (onThemeChange) {
      onThemeChange(nextTheme);
    }
  };

  return (
    <View style={[styles.container, themeStyle.container]}>
      <Text style={[styles.title, themeStyle.text]}>CONFIGURACION</Text>
      
      <View style={[styles.section, themeStyle.section]}>
        <Text style={[styles.label, themeStyle.text]}>PRESUPUESTO ACTUAL: ${currentBudget.toFixed(2)}</Text>
        <TextInput
          style={[styles.input, themeStyle.input]}
          placeholder="NUEVO PRESUPUESTO"
          placeholderTextColor={isDark ? '#777777' : '#999999'}
          value={budgetInput}
          onChangeText={setBudgetInput}
          keyboardType="numeric"
        />
        <TouchableOpacity style={[styles.button, themeStyle.button]} onPress={handleSaveBudget}>
          <Text style={[styles.buttonText, themeStyle.buttonText]}>GUARDAR PRESUPUESTO</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, themeStyle.section]}>
        <Text style={[styles.label, themeStyle.text]}>TEMA ACTUAL: {theme.toUpperCase()}</Text>
        <TouchableOpacity style={[styles.button, themeStyle.button]} onPress={handleToggleTheme}>
          <Text style={[styles.buttonText, themeStyle.buttonText]}>CAMBIAR TEMA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 0,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },

  section: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 0,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 0,
    fontSize: 14,
  },

  button: {
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 0,
  },

  buttonText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },

});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },

  text: {
    color: '#000000',
  },

  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    color: '#000000',
  },

  button: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },

  buttonText: {
    color: '#FFFFFF',
  },

});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },

  text: {
    color: '#FFFFFF',
  },

  section: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
  },

  input: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
    color: '#FFFFFF',
  },

  button: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },

  buttonText: {
    color: '#000000',
  },

});