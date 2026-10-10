import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MovementRow({ item, onDelete, isDark }) {
  const themeStyle = isDark ? darkStyles : lightStyles;
  return (
    <View style={[styles.row, themeStyle.row]}>
      <View style={styles.info}>
        <Text style={[styles.text, themeStyle.text]}>{item.description}</Text>
        <Text style={[styles.subText, themeStyle.subText]}>{item.category} - {item.createdAt}</Text>
      </View>
      <Text style={[styles.amount, themeStyle.text]}>
        {item.type === 'ingreso' ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
      <TouchableOpacity style={[styles.deleteBtn, themeStyle.deleteBtn]} onPress={() => onDelete(item.id)}>
        <Text style={[styles.deleteText, themeStyle.deleteText]}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderRadius: 0,
  },
  
  info: {
    flex: 1,
  },
  
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  subText: {
    fontSize: 12,
  },
  
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  
  deleteBtn: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 0,
  },
  
  deleteText: {
    fontWeight: 'bold',
  },
  
});

const lightStyles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#000000',
  },
  
  text: {
    color: '#000000',
  },
  
  subText: {
    color: '#666666',
  },
  
  deleteBtn: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  
  deleteText: {
    color: '#000000',
  },
  
});

const darkStyles = StyleSheet.create({
  row: {
    backgroundColor: '#000000',
    borderBottomColor: '#FFFFFF',
  },
  
  text: {
    color: '#FFFFFF',
  },
  
  subText: {
    color: '#AAAAAA',
  },
  
  deleteBtn: {
    borderColor: '#FFFFFF',
    backgroundColor: '#000000',
  },
  
  deleteText: {
    color: '#FFFFFF',
  },
  
});