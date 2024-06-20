import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { ListItem, Avatar } from '@rneui/themed';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../lib/firebaseConfig';
import { useAuth } from '../../context/auth';
import { Stack } from 'expo-router';

export default function Perimetria() {
  const { user } = useAuth();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFichasPerimetria();
    }
  }, [user]);

  const fetchFichasPerimetria = async () => {
    try {
      const fichasCollection = collection(firestore, 'fichasPerimetria');
      const q = query(fichasCollection);
      const querySnapshot = await getDocs(q);
      const fichasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFichas(fichasData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fichasPerimetria: ', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Perimetria' }} />
      <View style={styles.container}>
        <FlatList
          data={fichas}
          renderItem={({ item }) => (
            <ListItem key={item.id} bottomDivider>
              <Avatar rounded source={{ uri: item.photoURL || 'https://via.placeholder.com/150' }} />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                <Text>{item.date}</Text>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
