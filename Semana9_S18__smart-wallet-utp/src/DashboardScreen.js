import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMovements, getBudget, getTheme } from './FinanceStorage';

export default function DashboardScreen() {
  const [movements, setMovements] = useState([]);
  const [budget, setBudget] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadData = async () => {
      const storedMovements = await getMovements();
      const storedBudget = await getBudget();
      const storedTheme = await getTheme();
      setMovements(storedMovements);
      setBudget(storedBudget);
      setTheme(storedTheme);
    };
    loadData();
  },
   []);

  const isDark = theme === 'dark';
  const themeStyle = isDark ? darkStyles : lightStyles;

  const totalIncome = movements
    .filter(m => m.type === 'ingreso')
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

  const totalExpense = movements
    .filter(m => m.type === 'gasto')
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

  const balance = totalIncome - totalExpense;
  const percentage = budget > 0 ? (totalExpense / budget) * 100 : 0;

  return (
    <View style={[styles.container, themeStyle.container]}>
      <Text style={[styles.title, themeStyle.text]}>DASHBOARD</Text>
      
      <View style={[styles.card, themeStyle.card]}>
        <Text style={[styles.label, themeStyle.subText]}>INGRESOS</Text>
        <Text style={[styles.value, themeStyle.text]}>${totalIncome.toFixed(2)}</Text>
      </View>

      <View style={[styles.card, themeStyle.card]}>
        <Text style={[styles.label, themeStyle.subText]}>GASTOS</Text>
        <Text style={[styles.value, themeStyle.text]}>${totalExpense.toFixed(2)}</Text>
      </View>

      <View style={[styles.card, themeStyle.card]}>
        <Text style={[styles.label, themeStyle.subText]}>SALDO DISPONIBLE</Text>
        <Text style={[styles.value, themeStyle.text]}>${balance.toFixed(2)}</Text>
      </View>

      <View style={[styles.card, themeStyle.card]}>
        <Text style={[styles.label, themeStyle.subText]}>PRESUPUESTO MENSUAL</Text>
        <Text style={[styles.value, themeStyle.text]}>${budget.toFixed(2)}</Text>
        <Text style={[styles.label, themeStyle.subText]}>CONSUMIDO: {percentage.toFixed(1)}%</Text>
      </View>

      {percentage >= 80 && percentage < 100 && (
        <View style={[styles.alertCard, themeStyle.alertCard]}>
          <Text style={[styles.alertText, themeStyle.alertText]}>ALERTA: HAS SUPERADO EL 80% DEL PRESUPUESTO</Text>
        </View>
      )}

      {percentage >= 100 && (
        <View style={[styles.alertCard, themeStyle.alertCard]}>
          <Text style={[styles.alertText, themeStyle.alertText]}>ALERTA CRITICA: PRESUPUESTO SUPERADO</Text>
        </View>
      )}
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
  
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 0,
  },
  
  label: {
    fontSize: 12,
    letterSpacing: 1,
  },
  
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  
  alertCard: {
    padding: 12,
    borderWidth: 2,
    marginTop: 8,
    borderRadius: 0,
  },
  
  alertText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
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
  
  subText: {
    color: '#666666',
  },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },
  
  alertCard: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  
  alertText: {
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
  
  subText: {
    color: '#AAAAAA',
  },
  
  card: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
  },
  
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  
  alertText: {
    color: '#000000',
  },
  
});