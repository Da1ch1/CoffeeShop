import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.input}
        placeholder="¿Qué producto te interesa?"
        placeholderTextColor="#171717"
        keyboardType="web-search"
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        {/* Aquí puedes agregar un ícono de búsqueda o dejar el botón vacío */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    height: 25,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    marginRight: 15,
  },
  button: {
    backgroundColor: '#171717',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
});

export default SearchBar;
