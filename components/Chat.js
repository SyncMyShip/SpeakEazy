import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, query, addDoc, onSnapshot, where, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  const { name, backgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });

    // define query that grabs "messages" collection from Firestore
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    // Function called when changes are made to the "messages collection"
    const unsubMsgs = onSnapshot(q, (docs) => {
      let newMessages = [];

      // iterates through each document
      docs.forEach(doc => {
        newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()), })
      });
      setMessages(newMessages);
    });

    // Clean up code
    return () => {
      if (unsubMsgs) unsubMsgs();
    }
  }, []);

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


 return (
   <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
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