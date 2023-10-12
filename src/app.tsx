import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Component } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './useCachedResources';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import HomeScreen from './homeScreen';


function App() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return <AppContent />
    }
}


export class AppContent extends Component {

    render() {
        return <SafeAreaProvider
            onLayout={() => this.onLayout()}
        >
            <PaperProvider theme={MD3DarkTheme}>
                <HomeScreen />
                <StatusBar />
            </PaperProvider>
        </SafeAreaProvider>
    }

    onLayout() {
        SplashScreen.hideAsync();
    }
}

export default App;