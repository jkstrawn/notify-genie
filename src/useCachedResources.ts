import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import Notifications from './notifications';

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = useState(false);

	// Load any resources or data that we need prior to rendering the app
	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();

				await Notifications.load();

			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	return isLoadingComplete;
}
