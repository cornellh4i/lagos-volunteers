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
  role: string;
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
  role: "Volunteer",
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
  const [role, setRole] = useState<string>("Volunteers");
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
    role,
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

  // Paths that can be accessed only by supervisors
  const supervisorPaths = [
    "/events/[eventid]/attendees",
    "/events/[eventid]/edit",
    "/events/create",
  ];

  // Paths that can be accessed only by admins
  // TODO: /manage is not an actual path yet; replace this with whatever is the 
  // eventual path for the manage website page
  const adminPaths = ["/manage", "/users/view"];

  const router = useRouter();
  useEffect(() => {
    const path = router.asPath;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && authPaths.includes(path)) {
        router.replace("/events/view");
      } else if (user) {
        // User is authenticated
        // Check if user has custom claims
        const idTokenResult = await user.getIdTokenResult();
        const { claims } = idTokenResult;

        if (claims) {
          // Redirect based on user role
          if (claims.admin) {
            // Admin can access any path
            setRole("Admin");
            setIsAuthenticated(true);
          } else if (claims.supervisor && !adminPaths.includes(path)) {
            // Supervisors only denied paths exclusively for admins
            setRole("Supervisor");
            setIsAuthenticated(true);
          } else if (claims.volunteer && !adminPaths.includes(path) && !supervisorPaths.includes(path)) {
            // Volunteers cannot access adminPaths or supervisorPaths
            setRole("Volunteer");
            setIsAuthenticated(true);
          } else if (claims.volunteer || claims.supervisor) {
            // Volunteer or supervisor, but attempting to access a restricted path
            router.replace("/events/view");
          } else {
            // All claims are false (should never happen in theory)
            router.replace("/login");
            setIsAuthenticated(false);
          }
        } else {
          // No custom claims found, redirect to login
          router.replace("/login");
          setIsAuthenticated(false);
        }
      } else {
        // User is not authenticated
        if (!publicPaths.includes(path)) {
          router.replace("/login");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
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
