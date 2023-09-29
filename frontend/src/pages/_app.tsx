import "../styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/utils/AuthContext";

export const theme = createTheme({
  typography: {
    fontFamily: "Helvetica, sans-serif",
  },
  palette: {
    primary: {
      main: "#d1d5db",
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
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
