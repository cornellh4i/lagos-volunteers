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
  useSignOut,
} from "react-firebase-hooks/auth";
import { onAuthStateChanged, UserCredential } from "firebase/auth";
import { useRouter } from "next/router";

// Define types for authentication context value
type AuthContextValue = {
  user: User | null | undefined;
  loading: boolean;
  error?: AuthError | Error | null | undefined;
  signInUser: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInUserWithCustomToken: (token: string) => Promise<void>;
  createFirebaseUser: (
    email: string,
    password: string
  ) => Promise<UserCredential | undefined>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  loading: true,
  signInUser: async () => {},
  signInUserWithCustomToken: async () => {},
  signOutUser: async () => {},
  createFirebaseUser: async () => {
    return undefined;
  },
});

// Define props type for authentication provider
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, loading, error] = useAuthState(auth);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const [signOut] = useSignOut(auth);

  const createFirebaseUser = async (
    email: string,
    password: string
  ): Promise<UserCredential | undefined> => {
    try {
      const response = await createUserWithEmailAndPassword(email, password);
      return response;
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
      console.log(result);
    } catch (error) {
      // TODO: Handle Different Auth Errors
      console.log(error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut();
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

  const publicPaths = [
    "/login",
    "/signup",
    "/password/forgot",
    "/password/reset/*",
    "/_404",
    "/_error",
  ];

  // Note: Authentication works but it flashes the home page before redirecting to login page. Need to find a workaround.

  const router = useRouter();
  useEffect(() => {
    const path = router.asPath;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !publicPaths.includes(path)) {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
