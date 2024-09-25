import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]); 
LogBox.ignoreLogs(["@firebase/auth: Auth (10.3.1):"]);

const App = () => {
  const [text, setText] = useState('');

  const firebaseConfig = {
    apiKey: "AIzaSyAAY_3sr9EXcJ8t_7-5VcPyGEAHRkbTwyE",
    authDomain: "speakeazy-d4aa2.firebaseapp.com",
    projectId: "speakeazy-d4aa2",
    storageBucket: "speakeazy-d4aa2.appspot.com",
    messagingSenderId: "609979425080",
    appId: "1:609979425080:web:36a70e2124604f7b1221cd"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Start" 
      >
        <Stack.Screen
          name="Welcome"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    width: '88%',
    borderWidth: 1,
    height: 50,
    padding: 10
  },
  textDisplay: {
    height: 50,
    lineHeight: 50
  }
});

export default App;