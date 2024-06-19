import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "@rneui/themed";
import { useSearch } from "../../context/search";
import { useAuth } from "../../context/auth";
import { firestore } from "../../lib/firebaseConfig";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";

export default function ProfilePage() {
  const { selectedUser } = useSearch();
  const { userUID, displayName, photoURL } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSelect = async () => {
    setLoading(true);
    const combinedId =
      userUID > selectedUser.uid
        ? userUID + selectedUser.uid
        : selectedUser.uid + userUID;
    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });
        await updateDoc(doc(firestore, "userChats", userUID), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(firestore, "userChats", selectedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: userUID,
            displayName: displayName,
            photoURL: photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: selectedUser?.displayName }} />
      <View style={styles.container}>
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Avatar
              rounded
              size="large"
              source={{
                uri: selectedUser?.photoURL,
              }}
              icon={{ name: "user", type: "font-awesome" }}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{selectedUser?.displayName}</Text>
              <Text style={styles.userEmail}>{selectedUser?.email}</Text>
              <Text style={styles.userFunction}>{selectedUser?.gender}</Text>
            </View>
          </View>
        </Card>
        <View style={styles.buttonContainer}>
          <Button title="Solicitar serviços" containerStyle={styles.button} />
          <Button
            title="Enviar mensagem"
            containerStyle={styles.button}
            loading={loading}
            onPress={() => handleSelect()}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  contentTitle: {
    fontSize: 32,
    marginBottom: 24,
  },
  contentText: {
    fontSize: 24,
  },
  cardContainer: {
    width: "89%",
    marginTop: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 15,
    width: "80%",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
  },
  userFunction: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "89%",
    marginTop: 10,
  },
  button: {
    width: "48%",
  },
});
