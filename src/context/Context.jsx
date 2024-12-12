import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  // Register a new user and save additional details in Firestore
  const handleRegister = async (email, password, role, username) => {
    try {
      //  Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    //  Save user data in Firestore 
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userData = {
        uid: userCredential.user.uid,
        email,
        role, // e.g., 'student', 'teacher', 'admin'
        username,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, userData);
      console.log("User registered successfully:", userData);
    } catch (error) {
      console.error("Registration error:", error.message);
      throw new Error("Failed to register. Please try again.");
    }
  };

  // Fetch user details (including role) on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...userData, 
          });
          setRole(userData.role); 
        } else {
          console.warn("User data not found in Firestore.");
          setCurrentUser(null);
          setRole(null);
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false); // Stop loading
    });

    return unsubscribe; 
  }, []);

  // Log out the user
  const logout = async () => {

    try{
     await signOut(auth);
      setCurrentUser(null);
     setRole(null);
     navigate('/')

   } catch (error){
     alert(error)
   }
     
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role, // Provide role for easy access in role-based routes
        loading,
        logout,
        handleRegister,
      }}
    >
      {!loading && children} {/* Render children only after loading */}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
