/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';
import { name as appName } from './app.json';

// Expo launches the root component as "main".
registerRootComponent(App);

// Keep the original native React Native targets working; they request "newapp".
AppRegistry.registerComponent(appName, () => App);
