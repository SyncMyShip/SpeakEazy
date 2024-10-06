import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StyleSheet, TouchableOpacity, View, Alert, Text } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();

    const onActionPress = () => {
        const options = [
            'Choose From Library', 
            'Take Picture', 
            'Send Location', 
            'Cancel'
        ];

        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }

            }
        )
    }

    // Function to create unique ref string for selected image
    const generateReference = (uri) => {
        const timeStamp = new Date().getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
      }

      // global function to send selected image to Firebase Storage
      const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
          const imageURL = await getDownloadURL(snapshot.ref)
          onSend({ image: imageURL })
        });
      }

    // Function letting users pick an image from a library
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions have not been granted");
        }
    }

    // Function letting users take a photo with their camera
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions have not been granted");
        }
    }

    // Function letting users share their location
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
    
        if (permissions?.granted) {
          const location = await Location.getCurrentPositionAsync({});
          
        if (location) {
            onSend({
                location: {
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                },
            });
          } else Alert.alert("Unable to fetch location")
        } else Alert.alert("Permissions to read location have not been granted");
    }

    return ( 
        <TouchableOpacity 
            style={styles.container} 
            accessible={true}
            accessibilityLabel="open actionsheet"
            accessibilityHint="Open actionsheet that let's user upload photo, take photo, share location, or cancel the action"
            onPress={onActionPress}
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}    
 
    const styles = StyleSheet.create({
        container: {
          width: 26,
          height: 26,
          marginLeft: 10,
          marginBottom: 10,
        },
        wrapper: {
          borderRadius: 13,
          borderColor: '#b2b2b2',
          borderWidth: 2,
          flex: 1,
          justifyContent: "center"
        },
        iconText: {
          color: '#b2b2b2',
          fontWeight: 'bold',
          fontSize: 14,
          backgroundColor: 'transparent',
          textAlign: 'center',
        },
      });


export default CustomActions;