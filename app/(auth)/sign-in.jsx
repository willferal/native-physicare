// import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
// import { React, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { images } from '../../constants';
// import FormField from '../../components/FormField';


// const SignIn = () => {
//   const [form, setForm] = useState({
//     email: "",
//     password: ""
//   })

//   return (
//     <SafeAreaView className="bg-primary h-full">
//       <ScrollView>
//         <View className="w-full justify-center h-full px-4 my-6">
//           <Image source={images.phyLogo} resizeMode='contain' className="w-[150px] h-[50px]"/>

//           <Text className="text-2xl text-white text-semibold mt-6 font-extrabold">Log in physycare</Text>

//           <FormField 
//             title="Email"
//             value={form.email}
//             handleChangeText={ (e) => setForm({...form, email: e})}
//             otherStyles="mt-7"
//             keyboardType="email-address"
//           />

//           <FormField 
//             title="Password"
//             value={form.password}
//             handleChangeText={ (e) => setForm({...form, password: e})}
//             otherStyles="mt-7"
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default SignIn

// const styles = StyleSheet.create({})



import { StyleSheet, View } from "react-native";
import { Link, Stack, router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "../../node_modules/@firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import { Input, Button, Text } from "@rneui/themed";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("123456");
    const [loading, setLoading] = useState(false);
  
    const handleSignIn = async () => {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/home')
      } catch (error) {
        console.error("Erro ao fazer login:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <View style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />
          <Text h3 style={styles.title}>
            Physicare
          </Text>
          <Text style={styles.subtitle}>Entre na sua conta</Text>
          <Input
            placeholder="Email"
            autoCapitalize="none"
            value={email}
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
            onPress={handleSignIn}
            loading={loading}
            containerStyle={styles.buttonContainer}
          />
          <Link href={"/sign-up"}>
            <Text style={styles.signupText}>
              Não possui uma conta? Cadastre-se agora!
            </Text>
          </Link>
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
  });