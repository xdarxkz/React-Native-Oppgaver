import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [counter, setCounter] = useState(0);

  // Funksjon for å øke telleren
  const increaseCounter = () => {
    setCounter(counter + 1);
  };

  // Funksjon for å redusere telleren, men aldri lavere enn 0 (det er standard)
  const decreaseCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fine Knapper :=) */}
      <TouchableOpacity style={styles.button} onPress={increaseCounter}>
        <Text style={styles.buttonText}>Øk teller</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={decreaseCounter}>
        <Text style={styles.buttonText}>Reduser teller</Text>
      </TouchableOpacity>

      {/* Teller visning */}
      <Text style={styles.counterLabel}>Teller er:</Text>
      <View style={styles.counterBox}>
        <Text style={styles.counterText}>{counter}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#487281',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  counterBox: {
    backgroundColor: '#D8DBE2',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
  },
});
