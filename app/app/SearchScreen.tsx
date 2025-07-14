import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import cemeteryRecords from '../data/cemetery_records.json';

// Define the type for a cemetery record
type CemeteryRecord = {
  Lastname: string;
  Firstname?: string;
  Middlename?: string;
  DOB?: string;
  DOD?: string;
  Section?: string;
  Block?: string;
  Plot?: string;
  'Place of birth'?: string;
  'Place of death'?: string;
  Notes?: string;
};


export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CemeteryRecord[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }
    const lower = text.toLowerCase();
    setResults(
      cemeteryRecords.filter(
        (rec) =>
          (rec.Lastname && rec.Lastname.toLowerCase().includes(lower)) ||
          (rec.Firstname && rec.Firstname.toLowerCase().includes(lower))
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cemetery Records Search</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleSearch}
        placeholder="Enter first or last name"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FlatList
        data={results}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.recordBox}>
            <Text style={styles.name}>
              {item.Firstname} {item.Middlename ? item.Middlename + ' ' : ''}{item.Lastname}
            </Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>DOB:</Text>
              <Text style={styles.value}>{item.DOB || '—'}</Text>
              <Text style={styles.label}>   DOD:</Text>
              <Text style={styles.value}>{item.DOD || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Section:</Text>
              <Text style={styles.value}>{item.Section || '—'}</Text>
              <Text style={styles.label}>   Block:</Text>
              <Text style={styles.value}>{item.Block || '—'}</Text>
              <Text style={styles.label}>   Plot:</Text>
              <Text style={styles.value}>{item.Plot || '—'}</Text>
            </View>
            {(item['Place of birth'] || item['Place of death']) && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Birth:</Text>
                <Text style={styles.value}>{item['Place of birth'] || '—'}</Text>
                <Text style={styles.label}>   Death:</Text>
                <Text style={styles.value}>{item['Place of death'] || '—'}</Text>
              </View>
            )}
            {item.Notes && <Text style={styles.notes}>{item.Notes}</Text>}
          </View>
        )}
        ListEmptyComponent={
          query.length >= 2 ? (
            <Text style={styles.noResult}>No results found.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  recordBox: {
    marginBottom: 22,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 13,
    marginRight: 2,
  },
  value: {
    color: '#333',
    fontSize: 13,
    marginRight: 10,
  },
  name: { fontSize: 18, fontWeight: '600' },
  notes: { fontStyle: 'italic', color: '#6a6a6a', marginTop: 6, fontSize: 13 },
  noResult: { color: '#999', textAlign: 'center', marginTop: 30 },
});
