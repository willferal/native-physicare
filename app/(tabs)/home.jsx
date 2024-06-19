import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import { Avatar, Card, Divider, ListItem, Text } from "@rneui/themed";
import { useAuth } from "../../context/auth";

function Item({ item }) {
  return (
    <ListItem key={item.name} bottomDivider>
      <Avatar
        source={{ uri: "https://randomuser.me/api/portraits/men/2.jpg" }}
      />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.function}</ListItem.Subtitle>
        <ListItem.Subtitle>{item.function}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
}
const pacients = [
  {
    name: "generic name 1",
    function: "generic function 1",
  },
  {
    name: "generic name 2",
    function: "generic function 2",
  },
  {
    name: "generic name 3",
    function: "generic function 3",
  },
  {
    name: "generic name 4",
    function: "generic function 4",
  },
  {
    name: "generic name 5",
    function: "generic function 5",
  },
  {
    name: "generic name 6",
    function: "generic function 6",
  },
  {
    name: "generic name 7",
    function: "generic function 7",
  },
  {
    name: "generic name 8",
    function: "generic function 8",
  },
];

export default function Home() {

  const { displayName, email, photoURL, gender } = useAuth();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Home" }} />
      <View style={styles.container}>
        <FlatList
          data={pacients}
          renderItem={Item}
          keyExtractor={({ name }) => name}
          ListHeaderComponent={() => {
            return (
              <>
                <Card containerStyle={styles.cardContainer}>
                  <View style={styles.cardContent}>
                    <Avatar
                      rounded
                      size="large"
                      source={{
                        uri: photoURL,
                      }}
                      icon={{ name: "user", type: "font-awesome" }}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{displayName}</Text>
                      <Text style={styles.userEmail}>
                        {email}
                      </Text>
                      <Text style={styles.userFunction}>
                        {gender}
                      </Text>
                    </View>
                  </View>
                </Card>
                <Divider
                  style={{ width: "auto", margin: 20 }}
                  subHeader="Pacientes"
                  subHeaderStyle={{
                    textAlign: "center",
                  }}
                />
              </>
            );
          }}
        />
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
    justifyContent: "center",
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
});