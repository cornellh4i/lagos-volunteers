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

type Role = "Volunteer" | "Supervisor" | "Admin";
// Define types for authentication context value
type AuthContextValue = {
  user: User | null | undefined;
  role: Role;
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
  const [role, setRole] = useState<Role>("Volunteer");
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
    "/verify",
  ];

  // Paths that can be accessed freely when not logged in
  const publicPaths = [
    "/login",
    "/signup",
    "/password/forgot",
    "/password/reset",
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

  const setUserRoleBasedOnClaims = (claims: any) => {
    if (claims.admin) {
      setRole("Admin");
      return "Admin";
    } else if (claims.supervisor) {
      setRole("Supervisor");
      return "Supervisor";
    } else if (claims.volunteer) {
      setRole("Volunteer");
      return "Volunteer";
    }
  };
  // paths that can be accessed when not verified
  const verifyPaths = ["/verify", "/password"];

  const isResetPage = (path: string) => {
    return path.startsWith("/password");
  };

  const router = useRouter();
  useEffect(() => {
    const path = router.asPath;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      let userRole;
      const regexMatcherforSupervisorPaths =
        /^\/events\/[a-zA-Z0-9_-]+\/(attendees|edit)|\/events\/create$/;

      // check auth state
      if (user) {
        const { claims } = await user.getIdTokenResult();
        if (claims) {
          userRole = setUserRoleBasedOnClaims(claims);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }

      if (!user && !publicPaths.includes(path) && !isResetPage(path)) {
        router.replace("/login");
      } else if (user && user.emailVerified && authPaths.includes(path)) {
        router.replace("/events/view");
      } else if (
        user &&
        user.emailVerified &&
        adminPaths.includes(path) &&
        userRole !== "Admin"
      ) {
        router.replace("/events/view");
      } else if (
        user &&
        user.emailVerified &&
        regexMatcherforSupervisorPaths.test(path) &&
        userRole === "Volunteer"
      ) {
        router.replace("/events/view");
      } else if (
        user &&
        !user.emailVerified &&
        !verifyPaths.includes(path) &&
        !isResetPage(path)
      ) {
        router.replace("/verify");
      }else{
        setIsAuthenticated(true);
      }
      const hideContent = () => setIsAuthenticated(false);
      router.events.on("routeChangeStart", hideContent);

      return () => {
        router.events.off("routeChangeStart", hideContent);
      };
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
