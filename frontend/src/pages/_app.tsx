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
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#568124", // green
      light: "#E5E9E0", // green gray
    },
    secondary: {
      main: "#8D8D8D", // dark gray
      light: "#D9D9D9", // medium gray
    },
    warning: {
      main: "#D67300", // orange
      light: "#F1E8DC", // muted orange
    },
    error: {
      main: "#CB2F2F", // red
      light: "#EDCDCD", // muted red
    },
    background: {
      default: "#FFFFFF",
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </StyledEngineProvider>
    </AuthProvider>
  );
};

export default App;
