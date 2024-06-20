import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../lib/firebaseConfig';
import { useAuth } from '../../context/auth';
import { Stack } from 'expo-router';

export default function FichasTreino() {
  const { userUID } = useAuth();
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    if (userUID) {
      fetchFichasTreino();
    } else {
      console.log('No user found');
    }
  }, [userUID]);

  const fetchFichasTreino = async () => {
    try {
      console.log('Fetching fichasTreino for user:', userUID);
      const fichasCollection = collection(firestore, 'fichasTreino');
      const q = query(fichasCollection);
      const querySnapshot = await getDocs(q);
      const fichasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched fichasTreino:', fichasData);
      setFichas(fichasData);
    } catch (error) {
      console.error('Error fetching fichasTreino: ', error);
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

  const toggleExpand = (id) => {
    setExpandedIds(prevExpandedIds => 
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter(expandedId => expandedId !== id)
        : [...prevExpandedIds, id]
    );
  };

  const renderItem = ({ item }) => {
    const dataTreino = item.dataTreino?.toDate ? item.dataTreino.toDate().toLocaleDateString() : 'N/A';
    const isExpanded = expandedIds.includes(item.id);

    return (
      <TouchableOpacity onPress={() => toggleExpand(item.id)} key={item.id}>
        <Card containerStyle={styles.card}>
      <Card.Title>{`Ficha de Treino ID: ${item.id}`}</Card.Title>
      <Card.Divider />
      <Text>Tipo de Treino: {item.tipoTreino}</Text>
      <Text>Objetivo: {item.objetivo}</Text>
      <Text>Data do Treino: {item.dataTreino}</Text>
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Card.Divider />
          <Text>Condições:</Text>
          <FlatList
            data={item.conditions || []}
            renderItem={({ item: condition }) => (
              <Text style={styles.conditionText}>{condition}</Text>
            )}
            keyExtractor={(condition, index) => `condition-${index}`}
          />
          <Card.Divider />
          <Text>Exercícios:</Text>
          <FlatList
            data={item.exerciseData || []}
            renderItem={({ item: exercicio }) => (
              <View style={styles.exercicioContainer}>
                <Text style={styles.exercicioNome}>{exercicio.exerciseType}</Text>
                <Text style={styles.exercicioDescricao}>{`Repetições: ${exercicio.repetitions}, Séries: ${exercicio.series}`}</Text>
                {/* Adicione outros campos conforme necessário */}
              </View>
            )}
            keyExtractor={(exercicio, index) => `${item.id}-${index}`}
          />
        </View>
      )}
      <Icon
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        type='font-awesome'
        color='#517fa4'
        containerStyle={styles.icon}
        onPress={toggleExpand}
      />
    </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Fichas de Treino' }} />
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
  exercicioContainer: {
    marginBottom: 10,
  },
  exercicioNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercicioDescricao: {
    fontSize: 14,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
