import { StyleSheet, View, Button, TextInput, Alert } from "react-native";
import { Avatar, SearchBar, ListItem } from "@rneui/themed";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { firestore } from "../../lib/firebaseConfig";
import { useAuth } from "../../context/auth";
import { useSearch } from "../../context/search";
import { FlatList } from "react-native-gesture-handler";

export default function SearchPage() {
  const { user, email } = useAuth();
  const { setSelectedUserContext } = useSearch();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users...");
      try {
        const usersCollection = collection(firestore, "professionals");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        const filteredUsersData = usersData.filter(
          (user) => user.email !== email
        );
        console.log("Fetched users: ", filteredUsersData);
        setUsers(filteredUsersData);
        setFilteredUsers(filteredUsersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, [email]);

  useEffect(() => {
    console.log("Filtering users...");
    const filteredResults = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filteredResults);
  }, [search, users]);

  function Item({ user, currentUser, setSelectedUserContext }) {
    const [loading, setLoading] = useState(false);
    const [problem, setProblem] = useState('');
    const [text, setText] = useState('');

    const handleRequest = async () => {
      console.log("Handling request...");
      if (!currentUser) {
        console.error("User is not authenticated");
        return;
      }

      setLoading(true);
      try {
        await setDoc(
          doc(firestore, "users", currentUser.uid, "myrequests", user.uid),
          {
            problem,
            text,
            status: "pending",
            to: user.uid,
            from: currentUser.uid,
            name: user.name,
            avatar: user.avatar,
          }
        );
        await setDoc(
          doc(firestore, "users", user.uid, "myrequests", currentUser.uid),
          {
            problem,
            text,
            status: "pending",
            to: user.uid,
            from: currentUser.uid,
            name: user.name,
            avatar: user.avatar,
          }
        );
        console.log("Request sent successfully");
        setProblem('');
        setText('');
      } catch (error) {
        console.error("Error sending request: ", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <ListItem
        onPress={() => {
          setSelectedUserContext(user);
          router.push(`/(protected)/search/${user.uid}`);
        }}
        key={user?.email}
        bottomDivider
      >
        <Avatar rounded source={{ uri: user?.photoURL }} />
        <ListItem.Content>
          <ListItem.Title>{user?.name}</ListItem.Title>
          <ListItem.Subtitle>{user?.email}</ListItem.Subtitle>
          <ListItem.Subtitle>{user?.gender}</ListItem.Subtitle>
          <View>
            <TextInput
              placeholder="Assunto:"
              value={problem}
              onChangeText={setProblem}
              style={styles.input}
            />
            <TextInput
              placeholder="Digite aqui:"
              value={text}
              onChangeText={setText}
              style={styles.input}
            />
          </View>
          <Button title="Enviar Solicitação" onPress={handleRequest} disabled={loading} />
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
          renderItem={({ item }) => (
            <Item
              user={item}
              currentUser={user} // Pass the user directly
              setSelectedUserContext={setSelectedUserContext}
            />
          )}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 4,
  },
});
