import { useEffect, useState } from 'react';
import axios from 'axios';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersResponse, postsResponse] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/users'),
        axios.get('https://jsonplaceholder.typicode.com/posts'),
      ]);

      setUsers(usersResponse.data.slice(0, 10));
      setPosts(postsResponse.data.slice(0, 10));
    } catch {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const request = setTimeout(loadData, 0);

    return () => clearTimeout(request);
  }, []);

  const data = activeTab === 'users' ? users : posts;

  return (
    <View>
      <Text>Consumo de API</Text>

      <View>
        <TouchableOpacity onPress={() => setActiveTab('users')}>
          <Text>Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('posts')}>
          <Text>Publicaciones</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={loadData}>
        <Text>Recargar datos</Text>
      </TouchableOpacity>

      {error && <Text>{error}</Text>}

      {loading ? (
        <Text>Cargando datos...</Text>
      ) : (
        <View>
          <Text>
            Mostrando {data.length}{' '}
            {activeTab === 'users' ? 'usuarios' : 'publicaciones'}
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              activeTab === 'users' ? (
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                  <Text>{item.address.city}</Text>
                </View>
              ) : (
                <View>
                  <Text>{item.title}</Text>
                  <Text>{item.body}</Text>
                </View>
              )
            }
          />
        </View>
      )}
    </View>
  );
}
