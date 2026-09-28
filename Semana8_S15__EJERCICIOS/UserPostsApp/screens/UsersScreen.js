import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );
      setUsers(response.data);
    } catch {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = setTimeout(loadUsers, 0);

    return () => clearTimeout(request);
  }, [loadUsers]);

  if (loading) {
    return <Text style={styles.message}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={loadUsers}>
        <Text style={styles.buttonText}>Recargar datos</Text>
      </TouchableOpacity>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.counter}>Mostrando {users.length} usuarios</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('Posts', {
                    userId: item.id,
                    userName: item.name,
                  })
                }
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.address.city}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginVertical: 5,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  counter: {
    marginBottom: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 6,
    marginBottom: 12,
    padding: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  message: {
    padding: 16,
  },
  error: {
    color: '#dc2626',
    padding: 16,
  },
});
