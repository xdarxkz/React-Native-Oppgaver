import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function App() {
  const [internetImageUrl, setInternetImageUrl] = useState('');

  useEffect(() => {
    // Sett en URL for bildet som hentes fra internett
    setInternetImageUrl('https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg'); 
    // URL-en peker på et eksempelbilde av katter. Du kan erstatte denne med en annen URL hvis du ønsker et annet bilde.
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Lokalt bilde */}
        <Image 
          source={require('/React Native - Oppgave 2024/Oppgave 2 - bilde/local-image.jpg')} 
          style={styles.image} 
        />
        {/* Internett-bilde */}
        {internetImageUrl !== '' && (
          <Image 
            source={{ uri: internetImageUrl }} 
            style={styles.image} 
          />
        )}
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
    // Hovedbeholderens stiler sørger for at innholdet er sentrert både vertikalt og horisontalt.
  },
  imageContainer: {
    alignItems: 'center',
    // Sørger for at bildene vises sentrert i midten av skjermen.
  },
  image: {
    width: 360, // Øker bredden på bildene
    height: 300, // Øker høyden på bildene
    resizeMode: 'cover',
    marginBottom: 20, // Legger til mellomrom mellom bildene
    // Bildene er større for bedre synlighet, og margin mellom bildene gir dem mer luft.
  },
});
