import React, {useEffect, useMemo, useState} from 'react';
import {Switch, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Coordinates} from '../types/Locations';
import {useBackgroundGeolocation} from '../hooks/useBackgroundLocation';

export const MapViewport = ({socket}: any) => {
  const [isReceiver, toggleIsReceiver] = useState(false);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const {location} = useBackgroundGeolocation();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // useMemo(() => {
  //   setLatitude(location?.coords?.latitude || 47.0);
  //   setLongitude(location?.coords?.longitude || 28.0);
  // }, [location]);

  useEffect(() => {
    setLatitude(location?.coords?.latitude || 47.0);
    setLongitude(location?.coords?.longitude || 28.0);

    socket.emit('update-location', {
      latitude,
      longitude,
    });
  }, [location]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected', socket.id);
      socket.on('update-location', (data: Coordinates) => {
        setCoords(_prevCoords => data);
      });

      socket.emit('create-location', {
        latitude,
        longitude,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Text>Is Reciever?</Text>
      <Switch value={isReceiver} onValueChange={toggleIsReceiver} />
      <MapView
        style={{flex: 1}}
        region={{
          latitude: isReceiver ? coords?.latitude || 47.0 : latitude,
          longitude: isReceiver ? coords?.longitude || 28.0 : longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          title="Curier"
          coordinate={{
            latitude: isReceiver ? coords?.latitude || 47.0 : latitude,
            longitude: isReceiver ? coords?.longitude || 28.0 : longitude,
          }}
        />
      </MapView>
    </>
  );
};
