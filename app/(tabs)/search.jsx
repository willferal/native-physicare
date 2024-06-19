import { StyleSheet, View } from "react-native";
import { Avatar, SearchBar, ListItem } from "@rneui/themed";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../lib/firebaseConfig";
import { useAuth } from "../../context/auth";
import { useSearch } from "../../context/search";
import { FlatList } from "react-native-gesture-handler";

export default function SearchPage() {
  const { email } = useAuth();
  const { setSelectedUserContext } = useSearch();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([
    {
      name: 'will',
      email: 'wilson@gmail.com',
      gender: 'masculino'
    }
  ]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, "professionals");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
      const filteredUsersData = usersData.filter(
        (user) => user.email !== email
      );
      console.log(filteredUsersData)
      setUsers(filteredUsersData);
      setFilteredUsers(filteredUsersData);
    };
    fetchUsers();
    const filteredResults = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filteredResults);
  }, []);

  //useEffect(() => {
    // const filteredResults = users.filter((user) =>
    //   user.name.toLowerCase().includes(search.toLowerCase())
    // );
    // setFilteredUsers(filteredResults);
  //}, [search, users]);

  function Item({ user }) {
    return (
      <ListItem
        onPress={() => {
          setSelectedUserContext(user);
          router.push(`/(protected)/search/${user.uid.toString()}`);
        }}
        key={user?.email}
        bottomDivider
      >
        <Avatar rounded source={{ uri: user?.photoURL }} />
        <ListItem.Content>
          <ListItem.Title>{user?.name}</ListItem.Title>
          <ListItem.Subtitle>{user?.email}</ListItem.Subtitle>
          <ListItem.Subtitle>{user?.gender}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Search" }} />
      <View style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
          platform="android"
          containerStyle={styles.searchBarContainer}
          onChangeText={(text) => setSearch(text)}
          value={search}
        />
        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => <Item user={item} />}
          keyExtractor={(item) => item.email}
          style={{ width: "100%" }}
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
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  searchBarContainer: {
    width: "100%",
  },
});
