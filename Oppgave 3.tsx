import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function App() {
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Toppfelt med kun "Passord" */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Passord</Text>
      </View>

      {/* Inndatafelt for passord */}
      <TextInput
        style={styles.input}
        placeholder="Skriv inn passordet ditt:"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      {/* Viser passordet til venstre */}
      <Text style={styles.passwordText}>Passordet ditt er: {password}</Text>

      {/* Meldingen om passordlengde plassert lengre ned */}
      <Text style={styles.infoText}>Passordet må minst ha 5 tegn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    backgroundColor: '#373F51',
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    
    margin: '5%',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start', // Justerer teksten til venstre
    marginLeft: '10%', // Gir litt margin fra venstre
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Samme farge som resten av teksten
    marginTop: 20, // Legger til litt avstand fra passordet
    top: 300,
  },
});
