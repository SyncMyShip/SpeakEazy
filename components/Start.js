import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#757083');
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
          <View style={styles.inputContainer}>
            <Image source={require('../assets/icon.svg')} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder='Your Name'
              placeholderTextColor="#757083"
            />
          </View>

          <Text style={styles.chooseColor}>Choose background color:</Text>

          <View style={styles.colorOptions}>
            {colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorBox,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorBox
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.startChatting, { backgroundColor: selectedColor }]}
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
    alignItems: 'center',
    height: '100%',
    width: '100%',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    borderWidth: 1,
    borderColor: '#757083',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757083',
    textAlign: 'left',
    width: '88%',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: '20px',
  },
  selectedColorBox: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  startChatting: {
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