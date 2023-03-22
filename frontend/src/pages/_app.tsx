import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/utils/AuthContext";
import { useAuth } from "@/utils/AuthContext";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#ff0000",
    },
    background: {
      default: "#fff",
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Layout>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </Layout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
