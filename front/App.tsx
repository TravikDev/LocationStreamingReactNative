import {View} from 'react-native';
import {io} from 'socket.io-client';
import {MapViewport} from './src/components/MapViewport';

const App = () => {
  const SERVER_URL = 'http://192.168.100.2:1337';
  const socket = io(SERVER_URL);

  return (
    <View style={{flex: 1}}>
      <MapViewport socket={socket} />
    </View>
  );
};

export default App;
