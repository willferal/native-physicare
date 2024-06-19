// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const SignUp = () => {
//   return (
//     <View>
//       <Text>SignUp</Text>
//     </View>
//   )
// }

// export default SignUp

// const styles = StyleSheet.create({})

import { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Link, Stack } from "expo-router";
import { Input, Button, Text, Avatar } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";

import { createUserWithEmailAndPassword, updateProfile } from "../../node_modules/@firebase/auth";
import { auth, storage, firestore } from "../../lib/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "../../node_modules/@firebase/storage";
import { doc, setDoc } from "../../node_modules/@firebase/firestore";

import defaultImage from "../../assets/icons/profile.png";

export default function SignUp() {
  const data = [
    { label: "Masculino", value: "Masculino" },
    { label: "Feminino", value: "Feminino" },
    { label: "Outros", value: "Outros" },
  ];

  const [profilePhoto, setProfilePhoto] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("wilson@gmail.com");
  const [password, setPassword] = useState("123456");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setProfilePhoto(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(currentDate);
      }
    } else {
      toggleDatepicker();
    }
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    return `${day}/${month}/${year}`;
  };

  const handleSignUp = async () => {
    if (profilePhoto === "") {
      return alert("You did not select any image.");
    }

    console.log("Clicado");
    console.log(displayName);
    console.log(dateOfBirth);
    console.log(gender);
    console.log(email);
    console.log(password);
    console.log(profilePhoto);

    const response = await fetch(profilePhoto);
    const imageBlob = await response.blob();

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const fileName = `${displayName + date}.png`
        .trim()
        .replace(/ /g, "")
        .toLowerCase();
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, imageBlob).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(firestore, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email: email,
              gender,
              photoURL: downloadURL,
            });
            await setDoc(doc(firestore, "userRelations", res.user.uid), {});
            await setDoc(doc(firestore, "userChats", res.user.uid), {});
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
        });
      });
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView>
          <Text h3 style={styles.title}>
            Physicare
          </Text>
          <Text style={styles.subtitle}>Cadastre sua conta</Text>
          <Pressable onPress={pickImageAsync}>
            <Avatar
              size={128}
              rounded
              source={profilePhoto ? { uri: profilePhoto } : defaultImage}
            />
          </Pressable>
          <Input
            placeholder="Nome"
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          {!showPicker && (
            <Pressable onPress={toggleDatepicker}>
              <Input
                placeholder="Data de nascimento"
                value={dateOfBirth ? formatDate(dateOfBirth) : ""}
                onChangeText={(text) => setDateOfBirth(text)}
                editable={false}
              />
            </Pressable>
          )}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Gênero"
            searchPlaceholder="Selecione..."
            value={gender}
            onChange={(item) => {
              setGender(item.value);
            }}
          />
          <Input
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Senha"
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button
            title="Entrar"
            onPress={handleSignUp}
            loading={loading}
            containerStyle={styles.buttonContainer}
          />
          <Link href={"/sign-in"}>
            <Text style={styles.signupText}>
              Já possui uma conta? Acesse agora!
            </Text>
          </Link>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  buttonContainer: {
    marginVertical: 20,
  },
  signupText: {
    textAlign: "center",
    color: "blue",
  },
  dropdown: {
    marginHorizontal: 8,
    marginBottom: 16,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  placeholderStyle: {
    color: "grey",
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
