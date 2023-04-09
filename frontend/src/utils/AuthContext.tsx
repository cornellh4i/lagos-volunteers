import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { auth } from "./firebase";
import { User, AuthError, signOut, signInWithCustomToken } from "firebase/auth";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";

// Define types for authentication context value
type AuthContextValue = {
  user: User | null | undefined;
  loading: boolean;
  error?: AuthError | Error | null | undefined;
  signInUser: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInUserWithCustomToken: (token: string) => Promise<void>;
  createFirebaseUser: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  loading: true,
  signInUser: async () => {},
  signInUserWithCustomToken: async () => {},
  signOutUser: async () => {},
  createFirebaseUser: async () => {},
});

// Define props type for authentication provider
type AuthProviderProps = {
  children: ReactNode;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, loading, error] = useAuthState(auth);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const createFirebaseUser = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (error) {
      //TODO: Handle Different Auth Errors
      console.log(error);
    }
  };

  const signInUserWithCustomToken = async (token: string) => {
    try {
      const result = await signInWithCustomToken(auth, token);
    } catch (error) {
      console.log(error);
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(email, password);
    } catch (error) {
      // TODO: Handle Different Auth Errors
      console.log(error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  const value = {
    user,
    loading,
    error,
    signInUser,
    signOutUser,
    signInUserWithCustomToken,
    createFirebaseUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
