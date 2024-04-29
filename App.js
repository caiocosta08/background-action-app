import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  try {

    const now = Date.now();

    // Tenta obter a localização atual do usuário
    const location = await getLocationAsync();
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
    console.log(`Current location: Latitude ${location?.coords?.latitude}, Longitude ${location?.coords?.longitude}`);

    // await request();
    return BackgroundFetch.BackgroundFetchResult.NewData;

  } catch (error) {
    console.log({ errorOnDefineTask: error })
  }
});

async function registerBackgroundFetchAsync() {
  // Primeiro, assegure-se de ter permissão para acessar a localização
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 1, // Intervalo mínimo de 1 minuto
      stopOnTerminate: false, // Continua executando mesmo após o app fechar
      startOnBoot: true, // Inicia automaticamente quando o dispositivo é ligado
    });
  } else {
    console.log('Location permission not granted');
  }
}

async function getLocationAsync() {
  try {
    let location = await Location.getCurrentPositionAsync({});
    console.log({ location })
    return location;
  } catch (error) {
    console.error("Couldn't get location", error);
    return null;
  }
}

const request = async () => {
  try {
    var response = await fetch('http://192.168.15.7:3000/livros');
    response = await response.json();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

export default function App() {
  useEffect(() => {
    console.log("useEffect: ", new Date());
    // request();
    // registerBackgroundFetchAsync();
    getLocationAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Exemplo de Background Fetch com Expo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
