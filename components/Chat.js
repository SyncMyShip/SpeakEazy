import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, query, addDoc, onSnapshot, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMsgs;
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      if (unsubMsgs) unsubMsgs();

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubMsgs = onSnapshot(q, (docs) => {
        let newMessages = [];

        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          })
        })
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }


    return () => {
      if (unsubMsgs) unsubMsgs();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    } 
  };

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: "#000" },
          left: { backgroundColor: "#FFF" },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  const renderCustomActions = (props) => {
    return (
      <CustomActions 
        onSend={onSend} 
        storage={storage} 
        userID={userID} 
        {...props} 
      />
    );  
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      { (Platform.OS === 'android' || Platform.OS === 'ios') && <KeyboardAvoidingView behavior="height" /> }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;