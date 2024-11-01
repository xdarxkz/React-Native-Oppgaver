import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Rød header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>En app</Text>
      </View>

      {/* Individuelt plasserte fargede blokker */}
      <View style={styles.blocksWrapper}>
        <TouchableOpacity style={[styles.block, styles.greenBlock]} />
        <TouchableOpacity style={[styles.block, styles.yellowBlock]} />
        <TouchableOpacity style={[styles.block, styles.blackBlock]} />
      </View>

      {/* Beholder for tekst og knapp */}
      <View style={styles.textAndButtonContainer}>
        {/* Sentret melding med unik tekst */}
        <Text
          style={styles.centerText}
          accessibilityLabel="meaninglessText"
          testID="meaninglessText"
        >
          Tekst som er uten mening!
        </Text>

        {/* OK-knapp med farge */}
        <TouchableOpacity
          style={styles.okButton}
          accessibilityLabel="okButton"
          testID="okButton"
        >
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // Dette er hovedbeholderen for appen. Den tar opp hele skjermen og setter bakgrunnen til hvit.
    // justifyContent sørger for å starte alt fra toppen (flex-start), og alignItems gjør at alt sentreres horisontalt.
  },
  header: {
    backgroundColor: '#ff3632',
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    // Her lager vi en rød header som dekker hele bredden av skjermen oppe.
    // paddingVertical legger til avstand over og under teksten, og alignItems sørger for at teksten er sentrert.
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    // Teksten i headeren er hvit, stor (20) og fet (bold).
  },
  blocksWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
    // Dette er en beholder for de fargede blokkene. De legges ut horisontalt (row) og sentreres på skjermen.
    // Det er også lagt til litt margin på toppen for å lage avstand fra headeren.
  },
  block: {
    width: 50,
    height: 50,
    position: 'absolute',
    // Dette er stilene som er felles for alle blokkene (grønn, gul, svart). 
    // Hver blokk er 50x50 pixler og posisjonert absolutt for å plasseres manuelt.
  },
  greenBlock: {
    backgroundColor: 'lime',
    top: -10,
    left: -190,
    // Grønn blokk er plassert litt til venstre (-190) og litt over toppen (-10).
  },
  yellowBlock: {
    backgroundColor: 'yellow',
    top: 50,
    alignItems: 'center',
    // Gul blokk er plassert litt lenger ned fra toppen (50) og sentrert horisontalt.
    // "alignItems" her er ubrukelig men jeg valgte fortsatt å ta den med for senere-utvikling.
  },
  blackBlock: {
    backgroundColor: 'black',
    top: -10,
    right: -190,
    // Svart blokk er plassert helt til høyre (-190) og litt over toppen (-10).
  },
  textAndButtonContainer: {
    alignItems: 'center',
    marginTop: 150,
    // Beholder som inneholder både tekst og knapp. Alt er sentrert horisontalt og plassert litt lenger ned (150) for å gi mer luft.
  },
  centerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 410,
    // Teksten i midten er stor (18) og fet (bold), sentrert horisontalt. 
    // marginBottom lager stor avstand mellom teksten og knappen. (Jeg trengte ikke så mye margin og jeg kunne ha gjort det på en annen måte men jeg vill være litt unik).
  },
  okButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    // Knappen har blå bakgrunn og litt padding rundt for å gjøre den større.
    // borderRadius gir rundere hjørner (5).
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    // Teksten inni knappen er hvit, stor (18) og fet (bold).
  },
});
