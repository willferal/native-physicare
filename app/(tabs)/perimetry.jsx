import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../lib/firebaseConfig';
import { useAuth } from '../../context/auth';
import { Stack } from 'expo-router';

export default function Perimetria() {
  const { userUID } = useAuth();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    if (userUID) {
      fetchFichasPerimetria();
    } else {
      console.log('No user found');
    }
  }, [userUID]);

  const fetchFichasPerimetria = async () => {
    try {
      console.log('Fetching fichasPerimetria for user:', userUID);
      const fichasCollection = collection(firestore, 'fichasPerimetria');
      const q = query(fichasCollection, where('patientUid', '==', userUID));
      const querySnapshot = await getDocs(q);
      const fichasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched fichasPerimetria:', fichasData);
      setFichas(fichasData);
    } catch (error) {
      console.error('Error fetching fichasPerimetria: ', error);
    } finally {
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

  const renderMeasurements = (measurements) => {
    return measurements.map((measurement, index) => (
      <Text key={index} style={styles.measurementText}>
        {measurement.measureName}: {measurement.value}
      </Text>
    ));
  };

  const toggleExpand = (id) => {
    setExpandedIds(prevExpandedIds => 
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter(expandedId => expandedId !== id)
        : [...prevExpandedIds, id]
    );
  };

  const renderItem = ({ item }) => {
    const dataMedida = item.dataMedida?.toDate ? item.dataMedida.toDate().toLocaleDateString() : 'N/A';
    const isExpanded = expandedIds.includes(item.id);

    return (
      <TouchableOpacity onPress={() => toggleExpand(item.id)} key={item.id}>
        <Card containerStyle={styles.card}>
          <Card.Title>{`Ficha ID: ${item.id}`}</Card.Title>
          <Card.Divider />
          <Text>Altura: {item.altura}</Text>
          <Text>Peso: {item.peso}</Text>
          <Text>Objetivo: {item.objetivo}</Text>
          <Text>Data da Medida: {dataMedida}</Text>
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Card.Divider />
              <Text>Medidas:</Text>
              {renderMeasurements(item.measurements || [])}
            </View>
          )}
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            type='font-awesome'
            color='#517fa4'
            containerStyle={styles.icon}
          />
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Perimetria' }} />
      <View style={styles.container}>
        <FlatList
          data={fichas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{ width: '100%' }}
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
  card: {
    marginBottom: 10,
  },
  expandedContent: {
    marginTop: 10,
  },
  measurementText: {
    fontSize: 16,
    marginVertical: 2,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
