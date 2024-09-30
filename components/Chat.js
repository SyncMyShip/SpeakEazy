import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, query, addDoc, onSnapshot, where, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMsgs;
  useEffect(() => {
    navigation.setOptions({ title: name });

    // if there is a connection data should be pulled from Firestore db
    if (isConnected === true) {

      // unregister current onSnapshot() listener to prevent multiple listeners running when useEffect is re-executed
      if (unsubMsgs) unsubMsgs();
      unsubMsgs = null;

      // define query that grabs "messages" collection from Firestore
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      // Function called when changes are made to the "messages collection"
      unsubMsgs = onSnapshot(q, (docs) => {
        let newMessages = [];

        // iterates through each document
        docs.forEach(doc => {
          newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()), })
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages(); // if no connection data should be pulled from cache


    // Clean up code
    return () => {
      if (unsubMsgs) unsubMsgs();
    }
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
     try {
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      } 
  }

  // Function is called in useEffect() if isConnected === false
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("messages") || [];
    setMessages(JSON.parse(cachedMessages));
  }


  const onSend = (newMessages) => {addDoc(collection(db, "messages"), newMessages[0])}


  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // only render input toolbar if isconnected === true
  const renderInputToolbar = (props) => {
    if (isConnected)
      return <InputToolbar {...props} />;
    else return null;
  }


  return (
    <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
          messages={messages}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={messages => onSend(messages)}
          user={{
            _id: userID,
            name: name
          }}
        />
        { Platform.OS === ('android') || Platform.OS === ('ios') ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
 }
});

export default Chat;