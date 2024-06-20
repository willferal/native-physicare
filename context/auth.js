import { auth, firestore } from "../lib/firebaseConfig";
import { createContext, useContext, useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc } from "firebase/firestore";
import { router, useSegments } from "expo-router";

export const AuthContext = createContext();

export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <AuthProvider />");
    }
  }

  return value;
}

const useProtectedRoute = (user) => {
  const segments = useSegments();
  useEffect(() => {
    const inTabsGroup = segments[0] === "(protected)";
    if (user && !inTabsGroup) {
      router.replace("/home");
    } else if (!user) {
      router.replace("/sign-in");
    }
  }, [user]);
};

export function AuthProvider({ children }) {
  const [user] = useAuthState(auth);
  const [userUID, setUserUID] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [email, setEmail] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [gender, setGender] = useState(null);

  const userDocRef = user ? doc(firestore, "users", user.uid) : null;
  const [snapshot] = useDocument(userDocRef);

  useEffect(() => {
    if (snapshot && snapshot.exists) {
      const data = snapshot.data();
      setUserUID(data?.uid || "");
      setDisplayName(data?.displayName || "");
      setEmail(data?.email);
      setPhotoURL(data?.photoURL || "");
      setGender(data?.gender);
    } else {
      setUserUID(null);
      setDisplayName(null);
      setEmail(null);
      setPhotoURL(null);
      setGender(null);
    }
  }, [snapshot]);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user, userUID, displayName, email, photoURL, gender }}>
      {children}
    </AuthContext.Provider>
  );
}
