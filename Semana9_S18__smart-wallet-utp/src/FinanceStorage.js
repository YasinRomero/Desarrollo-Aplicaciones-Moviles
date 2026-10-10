import AsyncStorage from '@react-native-async-storage/async-storage';

const MOVEMENTS_KEY = '@smartwallet/movements';
const BUDGET_KEY = '@smartwallet/budget';
const THEME_KEY = '@smartwallet/theme';

export const getMovements = async () => {
  try {
    const data = await AsyncStorage.getItem(MOVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveMovements = async (movements) => {
  try {
    await AsyncStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
  } catch {}
};

export const getBudget = async () => {
  try {
    const data = await AsyncStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : 0;
  } catch {
    return 0;
  }
};

export const saveBudget = async (budget) => {
  try {
    await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  } catch {}
};

export const getTheme = async () => {
  try {
    const data = await AsyncStorage.getItem(THEME_KEY);
    return data ? JSON.parse(data) : 'light';
  } catch {
    return 'light';
  }
};

export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(theme));
  } catch {}
};