import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../assets/background-image.png')}  
        resizeMode='cover'
      >
        <Text style={styles.appTitle}>SpeakEazy</Text>
        <View style={styles.box}>

        
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Your Name'
            placeholderTextColor="#757083"
          />
          
          <Text style={styles.chooseColor}>Choose background color:</Text>

          <View style={styles.colorOptions}>
            {colors.map(color => (
              <TouchableOpacity key={color} style={[styles.colorBox, { backgroundColor: color }]} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.startChatting}
            onPress={() => navigation.navigate('Chat', { name: name })}
          >
            <Text style={styles.startChattingText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    // padding: 20,
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 90,
  },
  box: {
    backgroundColor: '#FFFFFF', 
    width: '88%',
    height: '44%', 
    alignItems: 'center',
    bottom: 20,
    position: 'absolute',
    justifyContent: 'space-around', 
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#757083',
    backgroundColor: '#FFFFFF',
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    fontWeight: '600'
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 90,
  },
  startChatting: {
    backgroundColor: '#757083',
    borderRadius: 5,
    padding: 10,
    width: '88%',
  },
  startChattingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Start;