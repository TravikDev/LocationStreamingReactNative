import { useEffect, useState } from 'react';
import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';

export const useBackgroundGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      newLocation => {
        // console.log('[onLocation]', newLocation);
        setLocation(newLocation);
      },
    );

    const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
      event => {
        // console.log('[onMotionChange]', event);
      },
    );

    const onActivityChange: Subscription =
      BackgroundGeolocation.onActivityChange(event => {
        // console.log('[onActivityChange]', event);
      });

    const onProviderChange: Subscription =
      BackgroundGeolocation.onProviderChange(event => {
        // console.log('[onProviderChange]', event);
      });

    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopTimeout: 5,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      batchSync: false,
    }).then(state => {
      setEnabled(state.enabled);
      console.log(
        '- BackgroundGeolocation is configured and ready: ',
        state.enabled,
      );
    });

    return () => {
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  const start = () => {
    BackgroundGeolocation.start();
  };

  const stop = () => {
    BackgroundGeolocation.stop();
    setLocation(null);
  };

  return {
    location,
    enabled,
    start,
    stop,
  };
};