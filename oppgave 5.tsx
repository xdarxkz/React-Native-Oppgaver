import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Switch,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

export default function WeatherApp() {
  // State hooks for ulike data
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherDescription, setWeatherDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [detailedWeather, setDetailedWeather] = useState<{
    vindhastighet?: number;
    vindretning?: number;
    nedbør?: number;
  }>({});
  const [nextThreeDaysWeather, setNextThreeDaysWeather] = useState<any[]>([]);
  const [isCelsius, setIsCelsius] = useState(true); // Toggle for enhet
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  useEffect(() => {
    const getLocation = async () => {
      // Ber om lokasjonstillatelse
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Tillatelse til lokasjon ble avvist.');
        return;
      }
      // Henter brukerens posisjon
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      fetchWeatherByCoordinates(location.coords.latitude, location.coords.longitude);
    };

    getLocation();
    // Bestemmer om det er natt basert på lokal tid
    setIsNight(new Date().getHours() >= 18 || new Date().getHours() < 6);
  }, []);

  // Henter værdata basert på koordinater
  const fetchWeatherByCoordinates = async (latitude: number, longitude: number) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );

      const { temperature: current_temperature, weathercode, windspeed, winddirection } = weatherResponse.data.current_weather;
      setTemperature(current_temperature);
      setWeatherDescription(getWeatherDescription(weathercode));
      setDetailedWeather({
        vindhastighet: windspeed || 0,
        vindretning: winddirection || 0,
        nedbør: (weatherResponse.data.hourly && weatherResponse.data.hourly.precipitation ? weatherResponse.data.hourly.precipitation[0] : 0)
      });
      // Setter værmelding for de neste tre dagene
      setNextThreeDaysWeather(weatherResponse.data.daily.time.map((day: string, index: number) => ({
        date: day,
        maxTemp: weatherResponse.data.daily.temperature_2m_max[index],
        minTemp: weatherResponse.data.daily.temperature_2m_min[index],
        precipitation: weatherResponse.data.daily.precipitation_sum[index],
      })));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('En feil oppstod. Vennligst prøv igjen senere.');
    }
  };

  // Henter værdata basert på bynavn
  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      if (response.data.results && response.data.results.length > 0) {
        const { latitude, longitude } = response.data.results[0];
        fetchWeatherByCoordinates(latitude, longitude);
      } else {
        setErrorMessage('Kunne ikke finne byen, vennligst prøv igjen.');
      }
    } catch (error) {
      setErrorMessage('En feil oppstod. Vennligst prøv igjen senere.');
    }
  };

  // Oversetter værkode til beskrivelse
  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Klar himmel',
      1: 'Hovedsakelig klar',
      2: 'Delvis skyet',
      3: 'Overskyet',
      45: 'Tåke',
      48: 'Isende tåke',
      51: 'Yr',
      61: 'Regnbyger',
      71: 'Snøbyger',
      95: 'Tordenvær',
    };
    return weatherCodes[code] || 'Ukjent';
  };

  // Funksjon for å håndtere pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    if (currentLocation) {
      fetchWeatherByCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude);
    }
    setRefreshing(false);
  };

  return (
    <ImageBackground
      // Dynamisk bakgrunn basert på tid på dagen
      source={{ uri: isNight ? 'https://img.icons8.com/color/452/full-moon.png' : 'https://img.icons8.com/color/452/sun--v1.png' }}
      style={styles.background}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Viser bynavn hvis satt */}
        {city ? <Text style={styles.cityText}>{city}</Text> : null}
        
        {/* Værbeskrivelse */}
        <Text style={styles.weatherText}>{weatherDescription}</Text>
        
        {/* Temperatur */}
        {temperature !== null && (
          <Text style={[styles.temperatureText, temperature < 0 && styles.coldTemperature]}>
            {isCelsius ? temperature : (temperature * 9/5 + 32).toFixed(1)}°{isCelsius ? 'C' : 'F'}
          </Text>
        )}
        
        {/* Enhet Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>°C</Text>
          <Switch
            value={!isCelsius}
            onValueChange={() => setIsCelsius(previousState => !previousState)}
            thumbColor="#fff"
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
          <Text style={styles.toggleText}>°F</Text>
        </View>
        
        {/* Detaljerte værdata */}
        {temperature !== null && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Vindhastighet: {detailedWeather.vindhastighet} km/t</Text>
            <Text style={styles.detailText}>Vindretning: {detailedWeather.vindretning}°</Text>
            <Text style={styles.detailText}>Nedbør: {detailedWeather.nedbør} mm</Text>
          </View>
        )}
        
        {/* Søkeinput for by */}
        <TextInput
          style={styles.input}
          placeholder='Søk etter by'
          placeholderTextColor='#ccc'
          value={city}
          onChangeText={setCity}
        />
        
        {/* Hent værknapp */}
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Hent vær</Text>
        </TouchableOpacity>
        
        {/* Feilmelding */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        
        {/* Værmelding for neste syv dager */}
        {nextThreeDaysWeather.length > 0 && (
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>Værmelding for neste 7 dager:</Text>
            {nextThreeDaysWeather.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastText}>{day.date}</Text>
                <Text style={styles.forecastText}>Maks: {isCelsius ? day.maxTemp : (day.maxTemp * 9/5 + 32).toFixed(1)}°{isCelsius ? 'C' : 'F'}</Text>
                <Text style={styles.forecastText}>Min: {isCelsius ? day.minTemp : (day.minTemp * 9/5 + 32).toFixed(1)}°{isCelsius ? 'C' : 'F'}</Text>
                <Text style={styles.forecastText}>Nedbør: {day.precipitation} mm</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cityText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  temperatureText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  coldTemperature: {
    color: 'red',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff6347', // Tomatfarge
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  forecastContainer: {
    marginTop: 20,
    width: '90%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  forecastTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  forecastDay: {
    marginBottom: 10,
  },
  forecastText: {
    fontSize: 18,
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    color: '#fff',
    fontSize: 18,
    marginHorizontal: 10,
  },
});
