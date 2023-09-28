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
  useCreateUserWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import { UserCredential, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Loading from "@/components/molecules/Loading";

// Define types for authentication context value
type AuthContextValue = {
  user: User | null | undefined;
  loading: boolean;
  error: AuthError | Error | null | undefined;
  signOutUser: () => Promise<void>;
  signInUserWithCustomToken: (token: string) => Promise<void>;
  createFirebaseUser: (
    email: string,
    password: string
  ) => Promise<UserCredential | undefined>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  loading: true,
  error: undefined,
  signInUserWithCustomToken: async () => {},
  signOutUser: async () => {},
  createFirebaseUser: async () => {
    return undefined;
  },
  isAuthenticated: false,
});

// Define props type for authentication provider
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, loading, error] = useAuthState(auth);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const [signOut] = useSignOut(auth);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

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
    signOutUser,
    signInUserWithCustomToken,
    createFirebaseUser,
    isAuthenticated,
  };

  // Paths that are related to user authentication and which will be redirected
  // to the dashboard when the user is already logged in
  const authPaths = [
    "/",
    "/login",
    "/signup",
    "/password/forgot",
    "/password/reset/*",
  ];

  // Paths that can be accessed freely when not logged in
  const publicPaths = [
    "/login",
    "/signup",
    "/password/forgot",
    "/password/reset/*",
    "/_404",
    "/_error",
  ];

  const router = useRouter();
  useEffect(() => {
    const path = router.asPath;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !publicPaths.includes(path)) {
        router.replace("/login");
        setIsAuthenticated(false);
      } else if (user && authPaths.includes(path)) {
        router.replace("/events/view");
      } else {
        setIsAuthenticated(true);
      }
    });
    return unsubscribe;
  }, [user, router, loading]);

  if (loading || !isAuthenticated) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
