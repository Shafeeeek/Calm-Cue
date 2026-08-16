import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppShell} from './src/components/app-shell';
import {colors} from './src/constants/colors';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.appBackground}
      />
      <AppShell />
    </SafeAreaProvider>
  );
}

export default App;
